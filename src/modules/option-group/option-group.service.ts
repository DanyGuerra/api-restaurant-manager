import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionGroup } from 'entities/option-group.entity';
import { Repository } from 'typeorm';
import { CreateOptionGroup } from './dto/create-option-group.dto';
import { UpdateOptionGroup } from './dto/update-option-group.dto';

@Injectable()
export class OptionGroupService {
  constructor(
    @InjectRepository(OptionGroup)
    private optionGroupRepository: Repository<OptionGroup>,
  ) {}

  async create(createOptionGroup: CreateOptionGroup) {
    const optionGroup =
      await this.optionGroupRepository.create(createOptionGroup);

    return await this.optionGroupRepository.save(optionGroup);
  }

  async getById(id: string) {
    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with id ${id} not found`);
    }

    return optionGroup;
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

    await this.optionGroupRepository.remove(optionGroup);

    return { message: `Option group with id ${id} deleted successfully` };
  }
}
