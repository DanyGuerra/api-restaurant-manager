import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from 'entities/product-group.entity';
import { Repository } from 'typeorm';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/udpate-product-group,dto';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup)
    private productGroupRepository: Repository<ProductGroup>,
  ) { }

  async create(productGroupDto: CreateProductGroupDto, businessId: string) {
    const productGroup = this.productGroupRepository.create({
      ...productGroupDto,
      business: { id: businessId },
    });

    try {
      return await this.productGroupRepository.save(productGroup);
    } catch (error) {
      if (error.code === '23505')
        // unique violation
        throw new ConflictException('Product group already exists');
      throw error;
    }
  }

  async getByBusinessId(id: string) {
    const productGroups = await this.productGroupRepository.find({
      where: { business: { id } },
    });

    if (productGroups.length === 0) {
      throw new NotFoundException('Product groups not found');
    }

    return productGroups;
  }

  async getByProductGroupId(id: string) {
    const productGroup = await this.productGroupRepository.findOne({
      where: { id },
    });

    if (!productGroup) {
      throw new NotFoundException('Product group not found');
    }

    return productGroup;
  }

  async updateProductGroupById(id: string, updateDto: UpdateProductGroupDto) {
    const productGroup = await this.productGroupRepository.findOne({
      where: { id },
    });

    if (!productGroup) {
      throw new NotFoundException(`Product group with id ${id} not found`);
    }

    Object.assign(productGroup, updateDto);

    try {
      return await this.productGroupRepository.save(productGroup);
    } catch (error) {
      if (error.code === '23505')
        // Postgres error code for unique violation
        throw new ConflictException('Product group already exists');
      throw error;
    }
  }

  async deleteProductGroupById(id: string) {
    const productGroup = await this.productGroupRepository.findOne({
      where: { id },
    });

    if (!productGroup) {
      throw new NotFoundException(`Product group with id ${id} not found`);
    }

    try {
      await this.productGroupRepository.remove(productGroup);
      return {
        message: `Product group "${productGroup.name}" deleted successfully`,
      };
    } catch (error) {
      if (error.code === '23503')
        // Postgres error code for constrait
        throw new ConflictException(
          'Product group debe de estar vacío para poder eliminarlo',
        );
      throw error;
    }
  }
}
