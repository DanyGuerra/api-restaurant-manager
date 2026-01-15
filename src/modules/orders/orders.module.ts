import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { Order } from 'entities/order.entity';
import { OrderItem } from 'entities/order-item.entity';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([Order, Product, ProductOption, OrderItem, OrderItemGroup, UserBusinessRole]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule { }
