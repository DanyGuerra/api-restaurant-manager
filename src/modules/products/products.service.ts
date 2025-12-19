import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'entities/product.entity';
import { Repository, ILike } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

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
      relations: ['option_groups', 'option_groups.options'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productGroupId} not found`);
    }

    return await this.productRepository.save(product);
  }

  async getProductsByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const whereCondition: any = {
      product_group: { business: { id: businessId } },
    };

    if (search) {
      whereCondition.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      relations: ['option_groups', 'option_groups.options'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.softRemove(product);

    return { message: `Product with id ${id} deleted successfully` };
  }
}
