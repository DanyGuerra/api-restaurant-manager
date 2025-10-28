import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductsDto: CreateProductDto[]) {
    const products = createProductsDto.map((dto) =>
      this.productRepository.create({
        ...dto,
        product_group: { id: dto.group_product_id },
      }),
    );
    return this.productRepository.save(products);
  }

  async updateProductById(id: string, updateDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    Object.assign(product, updateDto);

    return await this.productRepository.save(product);
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async getByProductGroupId(productGroupId: string) {
    const product = await this.productRepository.find({
      where: { product_group: { id: productGroupId } },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with id ${productGroupId} not found`,
      );
    }

    return await this.productRepository.save(product);
  }

  async deleteById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.remove(product);

    return { message: `Product with id ${id} deleted successfully` };
  }
}
