import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductOptionService } from './product-option.service';
import { ProductOptionController } from './product-option.controller';
import { ProductOption } from 'entities/product-option.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOption, UserBusinessRole])],
  providers: [ProductOptionService],
  controllers: [ProductOptionController],
})
export class ProductOptionModule {}
