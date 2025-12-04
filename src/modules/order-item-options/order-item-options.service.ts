import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemOption } from 'entities/order-item-option.entity';
import { CreateOrderItemOptionDto } from './dto/create-order-item-option.dto';
import { UpdateOrderItemOptionDto } from './dto/update-order-item-option.dto';

@Injectable()
export class OrderItemOptionsService {
    constructor(
        @InjectRepository(OrderItemOption)
        private orderItemOptionRepository: Repository<OrderItemOption>,
    ) { }

    async create(createOrderItemOptionDto: CreateOrderItemOptionDto) {
        const option = this.orderItemOptionRepository.create({
            ...createOrderItemOptionDto,
            orderItem: { id: createOrderItemOptionDto.orderItemId },
            productOption: { id: createOrderItemOptionDto.productOptionId },
        });
        return await this.orderItemOptionRepository.save(option);
    }

    async findAll() {
        return await this.orderItemOptionRepository.find({
            relations: ['orderItem', 'productOption'],
        });
    }

    async findOne(id: string) {
        const option = await this.orderItemOptionRepository.findOne({
            where: { id },
            relations: ['orderItem', 'productOption'],
        });

        if (!option) {
            throw new NotFoundException(`OrderItemOption with id ${id} not found`);
        }

        return option;
    }

    async update(id: string, updateOrderItemOptionDto: UpdateOrderItemOptionDto) {
        const option = await this.findOne(id);

        Object.assign(option, updateOrderItemOptionDto);

        return await this.orderItemOptionRepository.save(option);
    }

    async remove(id: string) {
        const option = await this.findOne(id);
        return await this.orderItemOptionRepository.remove(option);
    }
}
