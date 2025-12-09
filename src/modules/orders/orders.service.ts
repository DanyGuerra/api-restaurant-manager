import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from 'entities/order.entity';
import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateFullOrderDto } from './dto/create-full-order.dto'
import { CartItemDto } from './dto/cart-item.dto';


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
        const { group_items, ...orderData } = createFullOrderDto;

        if (!group_items || group_items.length === 0) {
            throw new NotFoundException('No order groups provided');
        }

        const allItems: CartItemDto[] = group_items.flatMap(group => group.items);

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
        const finalItemGroups = group_items.map(group => {
            const { subtotal, items } = processGroupItems(group.items);
            orderTotal += subtotal;
            const groupName = group.group_name;

            return {
                name: groupName,
                subtotal: subtotal,
                items: items,
            };
        });

        const order = this.orderRepository.create({
            ...orderData,
            business: { id: businessId },
            user: { id: userId },
            total: orderTotal,
            itemGroups: finalItemGroups,
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
