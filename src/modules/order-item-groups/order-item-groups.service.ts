import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { CreateOrderItemGroupDto } from './dto/create-order-item-group.dto';
import { UpdateOrderItemGroupDto } from './dto/update-order-item-group.dto';

@Injectable()
export class OrderItemGroupsService {
    constructor(
        @InjectRepository(OrderItemGroup)
        private orderItemGroupRepository: Repository<OrderItemGroup>,
    ) { }

    async create(createOrderItemGroupDto: CreateOrderItemGroupDto) {
        const group = this.orderItemGroupRepository.create({
            ...createOrderItemGroupDto,
            order: { id: createOrderItemGroupDto.order_id },
        });
        return await this.orderItemGroupRepository.save(group);
    }

    async findAllByBusinessId(businessId: string) {
        return await this.orderItemGroupRepository.find({
            where: {
                order: {
                    business: {
                        id: businessId,
                    },
                },
            },
            relations: ['order', 'items'],
        });
    }

    async findAllByOrderId(orderId: string) {
        return await this.orderItemGroupRepository.find({
            where: {
                order: {
                    id: orderId,
                },
            },
            relations: ['order', 'items'],
        });
    }

    async findOne(id: string) {
        const group = await this.orderItemGroupRepository.findOne({
            where: { id },
            relations: ['order', 'items'],
        });

        if (!group) {
            throw new NotFoundException(`OrderItemGroup with id ${id} not found`);
        }

        return group;
    }

    async update(id: string, updateOrderItemGroupDto: UpdateOrderItemGroupDto) {
        const group = await this.findOne(id);

        if (updateOrderItemGroupDto.name !== undefined) {
            group.name = updateOrderItemGroupDto.name;
        }
        if (updateOrderItemGroupDto.subtotal !== undefined) {
            group.subtotal = updateOrderItemGroupDto.subtotal;
        }

        return await this.orderItemGroupRepository.save(group);
    }

    async remove(id: string) {
        const group = await this.findOne(id);
        return await this.orderItemGroupRepository.remove(group);
    }
}
