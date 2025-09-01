import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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
    const productOption =
      await this.productOptionRepository.create(productOptionDto);
    return this.productOptionRepository.save(productOption);
  }
}
