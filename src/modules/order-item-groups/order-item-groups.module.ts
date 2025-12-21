import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemGroupsService } from './order-item-groups.service';
import { OrderItemGroupsController } from './order-item-groups.controller';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemGroup, UserBusinessRole])],
  controllers: [OrderItemGroupsController],
  providers: [OrderItemGroupsService],
  exports: [OrderItemGroupsService],
})
export class OrderItemGroupsModule { }
