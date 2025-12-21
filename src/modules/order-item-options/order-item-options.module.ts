import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemOptionsService } from './order-item-options.service';
import { OrderItemOptionsController } from './order-item-options.controller';
import { OrderItemOption } from 'entities/order-item-option.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemOption, UserBusinessRole])],
  controllers: [OrderItemOptionsController],
  providers: [OrderItemOptionsService],
  exports: [OrderItemOptionsService],
})
export class OrderItemOptionsModule { }
