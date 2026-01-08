import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'entities/order.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

import { UserBusinessRole } from 'entities/user-business-role.entity';
import { OrderItem } from 'entities/order-item.entity';
import { OrderItemOption } from 'entities/order-item-option.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, UserBusinessRole, OrderItem, OrderItemOption])],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule { }
