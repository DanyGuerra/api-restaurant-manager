import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemGroupsService } from './order-item-groups.service';
import { OrderItemGroupsController } from './order-item-groups.controller';
import { OrderItemGroup } from 'entities/order-item-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrderItemGroup])],
    controllers: [OrderItemGroupsController],
    providers: [OrderItemGroupsService],
    exports: [OrderItemGroupsService],
})
export class OrderItemGroupsModule { }
