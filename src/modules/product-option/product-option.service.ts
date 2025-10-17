import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductOption } from 'entities/product-option.entity';
import { CreateProductOptionDto } from './dto/create-product-option.dto';

@Injectable()
export class ProductOptionService {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
  ) {}

  async create(productOptionDto: CreateProductOptionDto) {
    try {
      const productOption =
        await this.productOptionRepository.create(productOptionDto);
      return await this.productOptionRepository.save(productOption);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('This option name is already taken');
      }
      throw error;
    }
  }
}
