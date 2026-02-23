import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { OrderItem } from 'entities/order-item.entity';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { Order } from 'entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto';
import { UpdateFullOrderDto } from './dto/update-full-order.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ConsumptionType, OrderStatus } from 'src/types/order';
import { OrdersGateway } from './orders.gateway';
import { CashRegisterService } from '../cash-register/cash-register.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemGroup)
    private orderItemGroupRepository: Repository<OrderItemGroup>,
    private readonly ordersGateway: OrdersGateway,
    private readonly cashRegisterService: CashRegisterService,
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: string, businessId: string) {
    const orderNumber = await this.getNextOrderNumber(businessId);

    const order = this.orderRepository.create({
      ...createOrderDto,
      business: { id: businessId },
      user: { id: userId },
      order_number: orderNumber,
    });

    const savedOrder = await this.orderRepository.save(order);
    this.ordersGateway.server.to(businessId).emit('orderCreated', savedOrder);
    return savedOrder;
  }

  private async getNextOrderNumber(businessId: string): Promise<number> {
    const maxOrder = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.business = :businessId', { businessId })
      .orderBy('order.order_number', 'DESC')
      .select(['order.order_number'])
      .getOne();

    return (maxOrder?.order_number || 0) + 1;
  }

  async createFullOrder(
    createFullOrderDto: CreateFullOrderDto,
    userId: string,
    businessId: string,
  ) {
    const { group_items, ...orderData } = createFullOrderDto;
    const { amount_paid } = orderData;

    if (!group_items || group_items.length === 0) {
      throw new NotFoundException('No order groups provided');
    }

    const allItems: CartItemDto[] = group_items.flatMap((group) => group.items);

    if (allItems.length === 0) {
      throw new NotFoundException('No items provided for order');
    }

    const productIds = allItems.map((item) => item.product_id);
    const optionIds = allItems.flatMap((item) => item.selected_options_ids);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    const options = await this.productOptionRepository.find({
      where: { id: In(optionIds) },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const optionMap = new Map(options.map((o) => [o.id, o]));

    const processGroupItems = (groupItems: CartItemDto[]) => {
      let groupSubtotal = 0;
      const processedItems = groupItems.map((item) => {
        const product = productMap.get(item.product_id);
        if (!product) {
          throw new NotFoundException(`Product with id ${item.product_id} not found`);
        }

        let itemPrice = Number(product.base_price);
        const itemOptions = item.selected_options_ids.map((optId) => {
          const option = optionMap.get(optId);
          if (!option) {
            throw new NotFoundException(`Option with id ${optId} not found`);
          }
          itemPrice += Number(option.price);
          return {
            productOption: { id: option.id },
            price: Number(option.price),
          };
        });

        const itemTotal = itemPrice * item.quantity;
        groupSubtotal += itemTotal;

        return {
          product: { id: item.product_id },
          quantity: item.quantity,
          is_ready: item.is_ready,
          item_total: itemTotal,
          options: itemOptions,
        };
      });
      return { subtotal: groupSubtotal, items: processedItems };
    };

    let orderTotal = 0;
    const finalItemGroups = group_items.map((group) => {
      const { subtotal, items } = processGroupItems(group.items);
      orderTotal += subtotal;
      const groupName = group.group_name;

      return {
        name: groupName,
        subtotal: subtotal,
        items: items,
      };
    });

    if (amount_paid && amount_paid < orderTotal) {
      throw new BadRequestException('Amount paid is less than the total');
    }

    const changeDue = amount_paid && amount_paid > orderTotal ? amount_paid - orderTotal : 0;

    if (changeDue > 0) {
      const register = await this.cashRegisterService.getCashRegister(businessId);
      if (Number(register.balance) < changeDue) {
        throw new BadRequestException('No hay suficiente dinero en la caja para dar el cambio');
      }
    }

    const orderNumber = await this.getNextOrderNumber(businessId);

    const order = this.orderRepository.create({
      ...orderData,
      business: { id: businessId },
      user: { id: userId },
      total: orderTotal,
      itemGroups: finalItemGroups,
      amount_paid: orderData.amount_paid,
      change: amount_paid ? amount_paid - orderTotal : undefined,
      paid: amount_paid ? amount_paid >= orderTotal : undefined,
      order_number: orderNumber,
    });

    const savedOrder = await this.orderRepository.save(order);
    this.ordersGateway.server.to(businessId).emit('orderCreated', savedOrder.status);

    if (savedOrder.amount_paid) {
      await this.cashRegisterService.addMoney(businessId, {
        amount: Number(savedOrder.amount_paid),
        description: `Pago de orden`,
        order_id: savedOrder.id,
      });

      if (savedOrder.change && Number(savedOrder.change) > 0) {
        await this.cashRegisterService.withdrawMoney(businessId, {
          amount: Number(savedOrder.change),
          description: `Cambio de orden`,
          order_id: savedOrder.id,
        });
      }
    }

    return savedOrder;
  }

  async updateFullOrder(
    id: string,
    updateFullOrderDto: UpdateFullOrderDto,
    businessId: string,
  ) {
    const { group_items, ...orderData } = updateFullOrderDto;

    Object.keys(orderData).forEach(
      (key) => orderData[key] === undefined && delete orderData[key],
    );

    const { amount_paid } = orderData;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['itemGroups'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    const oldAmountPaid = Number(order.amount_paid) || 0;
    const oldChange = Number(order.change) || 0;

    Object.assign(order, orderData);

    let orderTotal = order.total;

    if (group_items && group_items.length > 0) {
      await this.orderItemGroupRepository.remove(order.itemGroups);
      order.itemGroups = [];

      const allItems: CartItemDto[] = group_items.flatMap((group) => group.items);

      if (allItems.length > 0) {
        const productIds = allItems.map((item) => item.product_id);
        const optionIds = allItems.flatMap((item) => item.selected_options_ids);

        const products = await this.productRepository.find({
          where: { id: In(productIds) },
        });

        const options = await this.productOptionRepository.find({
          where: { id: In(optionIds) },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));
        const optionMap = new Map(options.map((o) => [o.id, o]));

        const processGroupItems = (groupItems: CartItemDto[]) => {
          let groupSubtotal = 0;
          const processedItems = groupItems.map((item) => {
            const product = productMap.get(item.product_id);
            if (!product) {
              throw new NotFoundException(`Product with id ${item.product_id} not found`);
            }

            let itemPrice = Number(product.base_price);
            const itemOptions = item.selected_options_ids.map((optId) => {
              const option = optionMap.get(optId);
              if (!option) {
                throw new NotFoundException(`Option with id ${optId} not found`);
              }
              itemPrice += Number(option.price);
              return {
                productOption: { id: option.id },
                price: Number(option.price),
              };
            });

            const itemTotal = itemPrice * item.quantity;
            groupSubtotal += itemTotal;

            return {
              product: { id: item.product_id },
              quantity: item.quantity,
              is_ready: item.is_ready,
              item_total: itemTotal,
              options: itemOptions,
            };
          });
          return { subtotal: groupSubtotal, items: processedItems };
        };

        orderTotal = 0;
        const finalItemGroups: any[] = group_items.map((group) => {
          const { subtotal, items } = processGroupItems(group.items);
          orderTotal += subtotal;
          const groupName = group.group_name;

          return {
            name: groupName,
            subtotal: subtotal,
            items: items,
          };
        });

        order.itemGroups = finalItemGroups as any;
      }
    }

    order.total = orderTotal;

    const finalAmountPaid = amount_paid !== undefined ? amount_paid : order.amount_paid;
    let newAmountPaid = 0;
    let newChange = 0;

    if (order.status === OrderStatus.CANCELLED) {
      order.amount_paid = null as any;
      order.change = null as any;
      order.paid = false;
    } else if (finalAmountPaid !== null && finalAmountPaid !== undefined) {
      newAmountPaid = Number(finalAmountPaid);
      newChange = newAmountPaid > orderTotal ? newAmountPaid - orderTotal : 0;

      order.amount_paid = newAmountPaid;
      order.change = newChange;
      order.paid = newAmountPaid >= orderTotal;
    } else {
      order.amount_paid = null as any;
      order.change = null as any;
      order.paid = false;
    }

    const deltaAmountPaid = newAmountPaid - oldAmountPaid;
    const deltaChange = newChange - oldChange;

    await this.verifyCashRegisterBalance(businessId, deltaAmountPaid, deltaChange);

    const savedOrder = await this.orderRepository.save(order);
    this.ordersGateway.server.to(businessId).emit('orderUpdated', savedOrder.status);

    const action = savedOrder.status === OrderStatus.CANCELLED ? 'cancel' : 'update';
    await this.applyCashRegisterUpdates(businessId, savedOrder.id, deltaAmountPaid, deltaChange, action);

    return savedOrder;
  }

  async findByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    consumption_type?: ConsumptionType,
    sort: 'ASC' | 'DESC' = 'ASC',
    start_date?: Date,
    end_date?: Date,
    customer_name?: string,
    paid?: boolean,
  ) {
    const queryBuilder = this.getOrderQueryBuilder().where('order.business = :businessId', {
      businessId,
    });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (consumption_type) {
      queryBuilder.andWhere('order.consumption_type = :consumption_type', { consumption_type });
    }

    if (start_date) {
      queryBuilder.andWhere('order.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      queryBuilder.andWhere('order.created_at <= :end_date', { end_date });
    }

    if (customer_name) {
      queryBuilder.andWhere('order.customer_name ILIKE :customer_name', { customer_name: `%${customer_name}%` });
    }

    if (paid !== undefined) {
      queryBuilder.andWhere('order.paid = :paid', { paid });
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.created_at', sort)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const order = await this.getOrderQueryBuilder().where('order.id = :id', { id }).getOne();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  private getOrderQueryBuilder() {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .leftJoinAndSelect('order.itemGroups', 'itemGroups')
      .leftJoinAndSelect('itemGroups.items', 'items')
      .leftJoin('items.product', 'product', 'product.deleted_at IS NOT NULL OR product.deleted_at IS NULL')
      .addSelect(['product.id', 'product.name'])
      .leftJoinAndSelect('items.options', 'options')
      .leftJoinAndSelect('options.productOption', 'productOption')
      .leftJoinAndSelect('productOption.group', 'group')
      .leftJoinAndSelect('order.orderLabels', 'orderLabels');
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, businessId: string) {
    const order = await this.findOne(id);

    const oldAmountPaid = Number(order.amount_paid) || 0;
    const oldChange = Number(order.change) || 0;

    Object.assign(order, updateOrderDto);

    let newAmountPaid = 0;
    let newChange = 0;

    if (order.status === OrderStatus.CANCELLED) {
      order.amount_paid = null as any;
      order.change = null as any;
      order.paid = false;
    } else if (order.amount_paid !== null && order.amount_paid !== undefined) {
      newAmountPaid = Number(order.amount_paid);
      newChange = newAmountPaid > order.total ? newAmountPaid - order.total : 0;

      order.amount_paid = newAmountPaid;
      order.change = newChange;
      order.paid = newAmountPaid >= order.total;
    } else {
      order.amount_paid = null as any;
      order.change = null as any;
      order.paid = false;
    }

    const deltaAmountPaid = newAmountPaid - oldAmountPaid;
    const deltaChange = newChange - oldChange;

    await this.verifyCashRegisterBalance(businessId, deltaAmountPaid, deltaChange);

    const savedOrder = await this.orderRepository.save(order);

    this.ordersGateway.server.to(businessId).emit('orderUpdated', savedOrder.status);

    const action = savedOrder.status === OrderStatus.CANCELLED ? 'cancel' : 'update';
    await this.applyCashRegisterUpdates(businessId, savedOrder.id, deltaAmountPaid, deltaChange, action);

    return await this.findOne(id);
  }

  async remove(id: string, businessId: string) {
    const order = await this.findOne(id);

    const amountPaid = Number(order.amount_paid) || 0;
    const change = Number(order.change) || 0;

    await this.verifyCashRegisterBalance(businessId, -amountPaid, -change);

    await this.orderRepository.softDelete(order.id);

    await this.applyCashRegisterUpdates(
      businessId,
      order.id,
      -amountPaid,
      -change,
      'delete'
    );

    this.ordersGateway.server.to(businessId).emit('orderDeleted', order.status);
    return order;
  }

  async recalculateOrderTotals(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['itemGroups', 'itemGroups.items', 'business'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const oldAmountPaid = Number(order.amount_paid) || 0;
    const oldChange = Number(order.change) || 0;

    let orderTotal = 0;

    order.itemGroups.forEach((group) => {
      let groupSubtotal = 0;
      if (group.items) {
        groupSubtotal = group.items.reduce((sum, item) => sum + Number(item.item_total), 0);
      }
      group.subtotal = groupSubtotal;
      orderTotal += groupSubtotal;
    });

    order.total = orderTotal;

    if (order.amount_paid !== null && order.amount_paid !== undefined) {
      const newAmountPaid = Number(order.amount_paid);
      const newChange = newAmountPaid > orderTotal ? newAmountPaid - orderTotal : 0;

      order.change = newChange;
      order.paid = newAmountPaid >= orderTotal;
    } else {
      order.amount_paid = null as any;
      order.change = null as any;
      order.paid = false;
    }

    const newAmountPaid = order.amount_paid !== null && order.amount_paid !== undefined ? Number(order.amount_paid) : 0;
    const newChange = order.change !== null && order.change !== undefined ? Number(order.change) : 0;

    const deltaAmountPaid = newAmountPaid - oldAmountPaid;
    const deltaChange = newChange - oldChange;

    if (order.business?.id) {
      await this.verifyCashRegisterBalance(order.business.id, deltaAmountPaid, deltaChange);
    }

    const savedOrder = await this.orderRepository.save(order);
    if (savedOrder.business?.id) {
      this.ordersGateway.server.to(savedOrder.business.id).emit('orderUpdated', savedOrder.status);
      await this.applyCashRegisterUpdates(savedOrder.business.id, savedOrder.id, deltaAmountPaid, deltaChange, 'update');
    }
    return savedOrder;
  }

  async removeOrderItem(orderId: string, itemId: string) {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
      relations: ['group', 'group.order'],
    });

    if (!item) {
      throw new NotFoundException(`Order item with id ${itemId} not found`);
    }

    await this.orderItemRepository.softRemove(item);

    await this.recalculateOrderTotals(orderId);
    const order = await this.findOne(orderId);
    return { message: 'Item removed and order updated', data: order };


  }

  async removeOrderItemGroup(orderId: string, itemGroupId: string) {
    const group = await this.orderItemGroupRepository.findOne({
      where: { id: itemGroupId },
      relations: ['order'],
    });

    if (!group) {
      throw new NotFoundException(`Order item group with id ${itemGroupId} not found`);
    }



    await this.orderItemGroupRepository.softRemove(group);

    await this.recalculateOrderTotals(orderId);
    const order = await this.findOne(orderId);
    return { message: 'Item group removed and order updated', data: order };
  }

  private async verifyCashRegisterBalance(
    businessId: string,
    deltaAmountPaid: number,
    deltaChange: number,
  ) {
    const totalWithdrawNeeded = Math.max(0, deltaChange) + Math.max(0, -deltaAmountPaid);
    const totalAddNeeded = Math.max(0, deltaAmountPaid) + Math.max(0, -deltaChange);

    if (totalWithdrawNeeded > 0) {
      const register = await this.cashRegisterService.getCashRegister(businessId);
      if (Number(register.balance) + totalAddNeeded < totalWithdrawNeeded) {
        throw new BadRequestException('No hay suficiente dinero en la caja para procesar el cambio o ajuste');
      }
    }
  }

  private async applyCashRegisterUpdates(
    businessId: string,
    orderId: string,
    deltaAmountPaid: number,
    deltaChange: number,
    action: 'update' | 'delete' | 'cancel' = 'update'
  ) {
    let actionText = '(Por actualización)';
    if (action === 'delete') actionText = '(Por eliminación)';
    if (action === 'cancel') actionText = '(Por cancelación)';

    if (deltaAmountPaid > 0) {
      await this.cashRegisterService.addMoney(businessId, {
        amount: deltaAmountPaid,
        description: `Pago adición orden ${actionText}`,
        order_id: orderId,
      });
    } else if (deltaAmountPaid < 0) {
      await this.cashRegisterService.withdrawMoney(businessId, {
        amount: -deltaAmountPaid,
        description: `Ajuste pago orden ${actionText}`,
        order_id: orderId,
      });
    }

    if (deltaChange > 0) {
      await this.cashRegisterService.withdrawMoney(businessId, {
        amount: deltaChange,
        description: `Reembolso/Cambio orden ${actionText}`,
        order_id: orderId,
      });
    } else if (deltaChange < 0) {
      await this.cashRegisterService.addMoney(businessId, {
        amount: -deltaChange,
        description: `Ajuste cambio orden ${actionText}`,
        order_id: orderId,
      });
    }
  }
}
