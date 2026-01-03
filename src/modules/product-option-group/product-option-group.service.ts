import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOptionGroup } from 'entities/product-option-group.entity';
import { Repository } from 'typeorm';
import { UpdateProductOptionGroupDto } from './dto/update-product-option-group.dto';
import { CreateProductOptionGroupDto } from './dto/create-product-option-group.dto';

@Injectable()
export class ProductOptionGroupService {
  constructor(
    @InjectRepository(ProductOptionGroup)
    private productOptionRepository: Repository<ProductOptionGroup>,
  ) { }

  async create(createPOG: CreateProductOptionGroupDto) {
    const productOptionGroup = await this.productOptionRepository.create({
      product: { id: createPOG.product_id },
      option_group: { id: createPOG.option_group_id },
    });

    try {
      return await this.productOptionRepository.save(productOptionGroup);
    } catch (error) {
      if (error.code === '23505')
        // Postgres error code for unique violation
        throw new ConflictException('Option group already exists for this product');
      throw error;
    }
  }

  async delete(dto: CreateProductOptionGroupDto) {
    const productOptionGroup = await this.productOptionRepository.findOne({
      where: {
        product: { id: dto.product_id },
        option_group: { id: dto.option_group_id },
      },
    });
    if (!productOptionGroup) {
      throw new NotFoundException(`Product option group with id ${dto.option_group_id} not found`);
    }

    await this.productOptionRepository.remove(productOptionGroup);

    return {
      message: `Product option group with id ${dto.option_group_id} deleted successfully`,
    };
  }

  async getAllByProductId(productId: string) {
    const productOptionGroup = await this.productOptionRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'option_group', 'option_group.options'],
    });

    if (productOptionGroup.length === 0) {
      throw new NotFoundException(`Product option groups with product id ${productId} not found`);
    }

    return productOptionGroup;
  }
  async update(dto: UpdateProductOptionGroupDto) {
    const currentPOG = await this.productOptionRepository.findOne({
      where: {
        product: { id: dto.product_id },
        option_group: { id: dto.current_option_group_id },
      },
    });

    if (!currentPOG) {
      throw new NotFoundException(
        `Product option group link not found for product ${dto.product_id} and option group ${dto.current_option_group_id}`,
      );
    }

    const newLinkExists = await this.productOptionRepository.findOne({
      where: {
        product: { id: dto.product_id },
        option_group: { id: dto.new_option_group_id },
      },
    });

    if (newLinkExists) {
      throw new ConflictException(
        `Product option group link already exists for product ${dto.product_id} and option group ${dto.new_option_group_id}`,
      );
    }

    try {
      const newPOG = this.productOptionRepository.create({
        product: { id: dto.product_id },
        option_group: { id: dto.new_option_group_id },
      });
      await this.productOptionRepository.save(newPOG);

      await this.productOptionRepository.remove(currentPOG);

      return newPOG;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product option group');
    }
  }
}
