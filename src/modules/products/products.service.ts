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
    const productIds = await this.productRepository
      .createQueryBuilder('product')
      .select('product.id')
      .addSelect('product.popularity')
      .where('product.group_product_id = :productGroupId', { productGroupId })
      .orderBy('product.popularity', 'DESC', 'NULLS LAST')
      .getMany()
      .then((products) => products.map((p) => p.id));

    if (productIds.length === 0) {
      throw new NotFoundException(`Product with id ${productGroupId} not found`);
    }

    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.option_groups', 'optionGroup')
      .leftJoinAndSelect('optionGroup.options', 'option')
      .where('product.id IN (:...ids)', { ids: productIds })
      .orderBy('product.popularity', 'DESC', 'NULLS LAST')
      .addOrderBy('option.popularity', 'DESC', 'NULLS LAST')
      .getMany();
  }

  async getProductsByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {

    const baseQuery = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.product_group', 'productGroup')
      .where('productGroup.business_id = :businessId', { businessId });

    if (search) {
      baseQuery.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    const total = await baseQuery.getCount();

    if (total === 0) {
      return {
        data: [],
        total,
        page,
        limit,
        totalPages: 0,
      };
    }

    const productIds = await baseQuery
      .select('product.id')
      .addSelect('product.popularity')
      .orderBy('product.popularity', 'DESC', 'NULLS LAST')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()
      .then((products) => products.map((p) => p.id));

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.option_groups', 'optionGroup')
      .leftJoinAndSelect('optionGroup.options', 'option')
      .where('product.id IN (:...ids)', { ids: productIds })
      .orderBy('product.popularity', 'DESC', 'NULLS LAST')
      .addOrderBy('option.popularity', 'DESC', 'NULLS LAST')
      .getMany();

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
