import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionGroup } from 'entities/option-group.entity';
import { Repository, ILike } from 'typeorm';
import { CreateOptionGroup } from './dto/create-option-group.dto';
import { UpdateOptionGroup } from './dto/update-option-group.dto';

@Injectable()
export class OptionGroupService {
  constructor(
    @InjectRepository(OptionGroup)
    private optionGroupRepository: Repository<OptionGroup>,
  ) { }

  async create(createOptionGroup: CreateOptionGroup, businessId: string) {
    const optionGroup = await this.optionGroupRepository.create({
      ...createOptionGroup,
      business: { id: businessId },
    });

    return await this.optionGroupRepository.save(optionGroup);
  }

  async getById(id: string) {
    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id },
      relations: ['product_option_groups'],
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with id ${id} not found`);
    }

    return optionGroup;
  }

  async getByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const queryBuilder = this.optionGroupRepository
      .createQueryBuilder('optionGroup')
      .leftJoinAndSelect('optionGroup.options', 'option')
      .where('optionGroup.business_id = :businessId', { businessId })
      .orderBy('optionGroup.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere('optionGroup.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [optionGroups, total] = await queryBuilder.getManyAndCount();

    optionGroups.forEach((group) => {
      if (group.options) {
        group.options.sort((a, b) => {
          const popularityA = a.popularity ?? 0;
          const popularityB = b.popularity ?? 0;
          return popularityB - popularityA;
        });
      }
    });

    return {
      data: optionGroups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateById(id: string, updateOptionGroup: UpdateOptionGroup) {
    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with id ${id} not found`);
    }

    Object.assign(optionGroup, updateOptionGroup);

    return await this.optionGroupRepository.save(optionGroup);
  }

  async deleteById(id: string) {
    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with id ${id} not found`);
    }

    try {
      await this.optionGroupRepository.remove(optionGroup);
      return { message: `Option group with id ${id} deleted successfully` };
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation
        throw new ConflictException(
          `Cannot delete option group because it still has related data.`,
        );
      }

      throw new InternalServerErrorException('Unexpected error while deleting business');
    }
  }
}
