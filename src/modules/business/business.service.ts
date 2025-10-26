import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'entities/business.entity';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async createBusiness(
    dto: CreateBusinessDto,
    userId: string,
  ): Promise<Business> {
    const business = this.businessRepository.create({
      ...dto,
      owner_id: userId,
    });

    try {
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'This business name is already taken for this owner',
        );
      }
      throw error;
    }
  }

  async updateBusiness(id: string, dto: UpdateBusinessDto): Promise<Business> {
    const business = await this.businessRepository.findOne({ where: { id } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const updatedBusiness = await this.businessRepository.merge(business, dto);

    return await this.businessRepository.save(updatedBusiness);
  }

  async save(business: Business) {
    return await this.businessRepository.save(business);
  }

  async getAll() {
    return await this.businessRepository.find({});
  }

  async getBusinessFullStructure(businessId: string) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: [
        'productGroup',
        'productGroup.products',
        'productGroup.products.option_groups',
        'productGroup.products.option_groups.options',
        'productGroup.products.option_groups.product_option_groups',
      ],
    });

    if (!business) {
      throw new NotFoundException(`Business with id ${businessId} not found`);
    }

    return business;
  }

  async getById(id: string) {
    const business = await this.businessRepository.findOneBy({ id });
    if (!business) {
      throw new NotFoundException(`Business not found`);
    }
    return await business;
  }

  async getByOwnerId(ownerId: string) {
    const business = await this.businessRepository.find({
      where: { owner_id: ownerId },
    });
    if (!business) {
      throw new NotFoundException(`Business not found`);
    }
    return await business;
  }

  async deleteById(id: string) {
    const business = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Business not found`);
    }

    try {
      await this.businessRepository.remove(business);

      return { message: `Business with id ${id} deleted successfully` };
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation
        throw new ConflictException(
          `Cannot delete business because it still has related data (e.g., products, options, or users).`,
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error while deleting business',
      );
    }
  }
}
