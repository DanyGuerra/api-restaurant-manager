import { Module } from '@nestjs/common';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroup } from 'entities/product-group.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductGroup, UserBusinessRole])],
  controllers: [ProductGroupController],
  providers: [ProductGroupService],
})
export class ProductGroupModule {}
