import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'entities/order.entity';
import { OrderStatus } from 'src/types/order';
import { SalesStats } from './interfaces/sales-stats.interface';

import { OrderItem } from 'entities/order-item.entity';
import { OrderItemOption } from 'entities/order-item-option.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(OrderItemOption)
        private orderItemOptionRepository: Repository<OrderItemOption>,
    ) { }

    async getSales(businessId: string, from?: Date, to?: Date, top_limit: number = 5): Promise<SalesStats> {
        // Base Query for Summary
        const query = this.orderRepository
            .createQueryBuilder('order')
            .select("SUM(order.total)", "total_sales")
            .addSelect("COUNT(order.id)", "total_orders")
            .where("order.business_id = :businessId", { businessId })
            .andWhere("order.status != :status", { status: OrderStatus.CANCELLED });

        // Query for Top 5 Products
        const productsQuery = this.orderItemRepository
            .createQueryBuilder('item')
            .leftJoin('item.group', 'group')
            .leftJoin('group.order', 'order')
            .leftJoin('item.product', 'product')
            .select('product.name', 'name')
            .addSelect('product.id', 'id')
            .addSelect('SUM(item.quantity)', 'quantity')
            .where('order.business = :businessId', { businessId })
            .andWhere('order.status != :status', { status: OrderStatus.CANCELLED })
            .groupBy('product.id')
            .addGroupBy('product.name')
            .orderBy('quantity', 'DESC')
            .limit(top_limit);

        // Query for Top 5 Options
        const optionsQuery = this.orderItemRepository
            .createQueryBuilder('item')
            .leftJoin('item.group', 'group')
            .leftJoin('group.order', 'order')
            .leftJoin('item.options', 'orderItemOption')
            .leftJoin('orderItemOption.productOption', 'productOption')
            .select('productOption.name', 'name')
            .addSelect('productOption.id', 'id')
            .addSelect('SUM(item.quantity)', 'quantity')
            .where('order.business = :businessId', { businessId })
            .andWhere('order.status != :status', { status: OrderStatus.CANCELLED })
            .andWhere('productOption.id IS NOT NULL')
            .groupBy('productOption.id')
            .addGroupBy('productOption.name')
            .orderBy('quantity', 'DESC')
            .limit(top_limit);

        if (from) {
            query.andWhere("order.created_at >= :from", { from });
            productsQuery.andWhere("order.created_at >= :from", { from });
            optionsQuery.andWhere("order.created_at >= :from", { from });
        }

        if (to) {
            query.andWhere("order.created_at <= :to", { to });
            productsQuery.andWhere("order.created_at <= :to", { to });
            optionsQuery.andWhere("order.created_at <= :to", { to });
        }

        const [summaryResult, topProducts, topOptions] = await Promise.all([
            query.getRawOne(),
            productsQuery.getRawMany(),
            optionsQuery.getRawMany(),
        ]);

        return {
            total_sales: parseFloat(summaryResult.total_sales) || 0,
            total_orders: parseInt(summaryResult.total_orders, 10) || 0,
            top_products: topProducts.map(p => ({ name: p.name, quantity: parseInt(p.quantity, 10), id: p.id })),
            top_options: topOptions.map(o => ({ name: o.name, quantity: parseInt(o.quantity, 10), id: o.id })),
        };
    }
}
