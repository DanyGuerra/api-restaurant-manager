import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from 'entities/order.entity';
import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { OrderItem } from 'entities/order-item.entity';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ConsumptionType, OrderStatus } from 'src/types/order';

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
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: string, businessId: string) {
    const order = this.orderRepository.create({
      ...createOrderDto,
      business: { id: businessId },
      user: { id: userId },
    });

    return await this.orderRepository.save(order);
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

    const order = this.orderRepository.create({
      ...orderData,
      business: { id: businessId },
      user: { id: userId },
      total: orderTotal,
      itemGroups: finalItemGroups,
      amount_paid: orderData.amount_paid,
      change: amount_paid ? amount_paid - orderTotal : undefined,
      paid: amount_paid ? amount_paid > orderTotal : undefined,
    });

    return await this.orderRepository.save(order);
  }

  async findByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    consumption_type?: ConsumptionType,
    sort: 'ASC' | 'DESC' = 'ASC',
    start_date?: string,
    end_date?: string,
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
      .leftJoinAndSelect('order.itemGroups', 'itemGroups')
      .leftJoinAndSelect('itemGroups.items', 'items')
      .leftJoin('items.product', 'product')
      .addSelect(['product.id', 'product.name'])
      .leftJoinAndSelect('items.options', 'options')
      .leftJoinAndSelect('options.productOption', 'productOption')
      .leftJoinAndSelect('productOption.group', 'group')
      .leftJoinAndSelect('order.orderLabels', 'orderLabels');
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    if (updateOrderDto.amount_paid && updateOrderDto.amount_paid < order.total) {
      throw new BadRequestException('Amount paid is less than the total');
    }

    if (updateOrderDto.amount_paid) {
      order.change = updateOrderDto.amount_paid - order.total;
      order.paid = updateOrderDto.amount_paid >= order.total;
    }

    return await this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return await this.orderRepository.softRemove(order);
  }

  async recalculateOrderTotals(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['itemGroups', 'itemGroups.items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

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

    if (order.amount_paid) {
      order.change = order.amount_paid - orderTotal;
      order.paid = order.amount_paid >= orderTotal;
    }

    return await this.orderRepository.save(order);
  }

  async removeOrderItem(itemId: string) {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
      relations: ['group', 'group.order'],
    });

    if (!item) {
      throw new NotFoundException(`Order item with id ${itemId} not found`);
    }

    const orderId = item.group?.order?.id;

    await this.orderItemRepository.softRemove(item);

    if (orderId) {
      await this.recalculateOrderTotals(orderId);
    }

    return { message: 'Item removed and order updated' };
  }

  async removeOrderItemGroup(itemGroupId: string) {
    const group = await this.orderItemGroupRepository.findOne({
      where: { id: itemGroupId },
      relations: ['order'],
    });

    if (!group) {
      throw new NotFoundException(`Order item group with id ${itemGroupId} not found`);
    }

    const orderId = group.order.id;

    await this.orderItemGroupRepository.softRemove(group);

    if (orderId) {
      await this.recalculateOrderTotals(orderId);
    }

    return { message: 'Item group removed and order updated' };
  }
}
