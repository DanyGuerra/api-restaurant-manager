import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Product } from 'entities/product.entity';
import { ProductOption } from 'entities/product-option.entity';
import { Order } from 'entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductOption])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
