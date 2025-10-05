import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOptionGroup } from 'entities/product-option-group.entity';
import { Repository } from 'typeorm';
import { CreateProductOptionGroupDto } from './dto/create-product-option-group.dto';

@Injectable()
export class ProductOptionGroupService {
  constructor(
    @InjectRepository(ProductOptionGroup)
    private productOptionRepository: Repository<ProductOptionGroup>,
  ) {}

  async create(createProductOptionGroup: CreateProductOptionGroupDto) {
    const productOptionGroup = await this.productOptionRepository.create(
      createProductOptionGroup,
    );
    return await this.productOptionRepository.save(productOptionGroup);
  }

  async delete(dto: CreateProductOptionGroupDto) {
    const productOptionGroup = await this.productOptionRepository.findOne({
      where: {
        product_id: dto.product_id,
        option_group_id: dto.option_group_id,
      },
    });
    if (!productOptionGroup) {
      throw new NotFoundException(
        `Product option group with id ${dto.option_group_id} not found`,
      );
    }

    await this.productOptionRepository.remove(productOptionGroup);

    return {
      message: `Product option group with id ${dto.option_group_id} deleted successfully`,
    };
  }

  async getAllByProductId(productId: string) {
    const productOptionGroup = await this.productOptionRepository.find({
      where: { product_id: productId },
      relations: ['product', 'option_group', 'option_group.options'],
    });

    if (productOptionGroup.length === 0) {
      throw new NotFoundException(
        `Product option groups with product id ${productId} not found`,
      );
    }

    return productOptionGroup;
  }
}
