import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionGroup } from 'entities/product-option-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionGroup])],
})
export class ProductOptionGroupModule {}
