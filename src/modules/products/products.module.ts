import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'entities/product.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, UserBusinessRole])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
