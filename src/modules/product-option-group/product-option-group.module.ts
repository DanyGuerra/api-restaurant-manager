import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionGroup } from 'entities/product-option-group.entity';

import { ProductOptionGroupController } from './product-option-group.controller';
import { ProductOptionGroupService } from './product-option-group.service';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionGroup, UserBusinessRole])],
  controllers: [ProductOptionGroupController],
  providers: [ProductOptionGroupService],
  exports: [ProductOptionGroupService],
})
export class ProductOptionGroupModule { }
