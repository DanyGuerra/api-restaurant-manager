import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId: string, businessId: string) {

        const order = this.orderRepository.create({
            ...createOrderDto,
            business: { id: businessId },
            user: { id: userId },
        });

        return await this.orderRepository.save(order);
    }

    async findByBusinessId(businessId: string) {
        return await this.orderRepository.find({
            where: { business: { id: businessId } },
            relations: ['business', 'user', 'itemGroups', 'orderLabels'],
        });
    }

    async findOne(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['business', 'user', 'itemGroups', 'orderLabels'],
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }

        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const order = await this.findOne(id);

        Object.assign(order, updateOrderDto);

        return await this.orderRepository.save(order);
    }

    async remove(id: string) {
        const order = await this.findOne(id);
        return await this.orderRepository.remove(order);
    }
}
