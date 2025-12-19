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
    const whereCondition: any = {
      business: { id: businessId },
    };

    if (search) {
      whereCondition.name = ILike(`%${search}%`);
    }

    const [optionGroups, total] = await this.optionGroupRepository.findAndCount({
      where: whereCondition,
      relations: ['options'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
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
