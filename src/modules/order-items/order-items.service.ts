import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from 'entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrdersGateway } from '../orders/orders.gateway';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly ordersGateway: OrdersGateway,
  ) { }

  async create(createOrderItemDto: CreateOrderItemDto) {
    const item = this.orderItemRepository.create({
      ...createOrderItemDto,
      product: { id: createOrderItemDto.product_id },
      group: createOrderItemDto.order_item_group_id
        ? { id: createOrderItemDto.order_item_group_id }
        : undefined,
    });
    return await this.orderItemRepository.save(item);
  }

  async findAll() {
    return await this.orderItemRepository.find({
      relations: ['product', 'group', 'options'],
    });
  }

  async findAllByOrderItemGroupId(orderItemGroupId: string) {
    return await this.orderItemRepository.find({
      where: { group: { id: orderItemGroupId } },
      relations: ['product', 'group', 'options'],
    });
  }

  async findOne(id: string) {
    const item = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['product', 'group', 'options', 'group.order', 'group.order.business'],
    });

    if (!item) {
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const item = await this.findOne(id);

    Object.assign(item, updateOrderItemDto);

    const savedItem = await this.orderItemRepository.save(item);

    // Emit socket event
    if (savedItem.group?.order?.business?.id) {
      this.ordersGateway.server
        .to(savedItem.group.order.business.id)
        .emit('orderUpdated', savedItem.group.order.status);
    }

    return savedItem;
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return await this.orderItemRepository.remove(item);
  }
}
