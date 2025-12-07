import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from 'entities/order.entity';
import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductOption)
        private productOptionRepository: Repository<ProductOption>,
    ) { }

    async create(createOrderDto: CreateOrderDto, userId: string, businessId: string) {

        const order = this.orderRepository.create({
            ...createOrderDto,
            business: { id: businessId },
            user: { id: userId },
        });

        return await this.orderRepository.save(order);
    }

    async createFullOrder(createFullOrderDto: CreateFullOrderDto, userId: string, businessId: string) {
        const { items, ...orderData } = createFullOrderDto;

        const productIds = items.map((item) => item.product_id);
        const optionIds = items.flatMap((item) => item.selected_options_ids);

        const products = await this.productRepository.find({
            where: { id: In(productIds) },
        });

        const options = await this.productOptionRepository.find({
            where: { id: In(optionIds) },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));
        const optionMap = new Map(options.map((o) => [o.id, o]));

        let orderTotal = 0;

        const orderItems = items.map((item) => {
            const product = productMap.get(item.product_id);
            if (!product) {
                throw new NotFoundException(
                    `Product with id ${item.product_id} not found`,
                );
            }

            let itemPrice = Number(product.base_price);
            const itemOptions = item.selected_options_ids.map((optId) => {
                const option = optionMap.get(optId);
                if (!option) {
                    throw new NotFoundException(
                        `Option with id ${optId} not found`,
                    );
                }
                itemPrice += Number(option.price);
                return {
                    productOption: { id: option.id },
                    price: Number(option.price),
                };
            });

            const itemTotal = itemPrice * item.quantity;
            orderTotal += itemTotal;

            return {
                product: { id: item.product_id },
                quantity: item.quantity,
                item_total: itemTotal,
                options: itemOptions,
            };
        });

        const order = this.orderRepository.create({
            ...orderData,
            business: { id: businessId },
            user: { id: userId },
            total: orderTotal,
            itemGroups: [
                {
                    name: 'Principal',
                    subtotal: orderTotal,
                    items: orderItems,
                },
            ],
        });

        return await this.orderRepository.save(order);
    }

    async findByBusinessId(businessId: string) {
        return await this.getOrderQueryBuilder()
            .where('order.business = :businessId', { businessId })
            .getMany();
    }

    async findOne(id: string) {
        const order = await this.getOrderQueryBuilder()
            .where('order.id = :id', { id })
            .getOne();

        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }

        return order;
    }

    private getOrderQueryBuilder() {
        return this.orderRepository.createQueryBuilder('order')
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

        return await this.orderRepository.save(order);
    }

    async remove(id: string) {
        const order = await this.findOne(id);
        return await this.orderRepository.softRemove(order);
    }
}
