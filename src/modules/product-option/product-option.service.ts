import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductOption } from 'entities/product-option.entity';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';

@Injectable()
export class ProductOptionService {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
  ) {}

  async create(productOptionDto: CreateProductOptionDto) {
    try {
      const productOption = await this.productOptionRepository.create(productOptionDto);
      return await this.productOptionRepository.save(productOption);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('This option name is already taken');
      }
      throw error;
    }
  }

  async update(updateOptionDto: UpdateProductOptionDto, productOptionId: string) {
    const productOption = await this.productOptionRepository.findOne({
      where: { id: productOptionId },
    });

    if (!productOption) {
      throw new NotFoundException(`Option with id ${productOptionId} not found`);
    }

    Object.assign(productOption, updateOptionDto);

    return await this.productOptionRepository.save(productOption);
  }

  async delete(productOptionId: string) {
    const productOption = await this.productOptionRepository.findOne({
      where: { id: productOptionId },
    });

    if (!productOption) {
      throw new NotFoundException(`Option with id ${productOptionId} not found`);
    }

    return await this.productOptionRepository.softRemove(productOption);
  }

  async findOne(id: string) {
    const productOption = await this.productOptionRepository.findOne({
      where: { id },
    });

    if (!productOption) {
      throw new NotFoundException(`Option with id ${id} not found`);
    }

    return productOption;
  }
}
