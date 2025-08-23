import {
  ConflictException,
  Injectable,
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

  async createBusiness(dto: CreateBusinessDto): Promise<Business> {
    const business = this.businessRepository.create(dto);

    try {
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error.code === '23505') {
        // Postgres error code for unique violation
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

  save(business: Business) {
    return this.businessRepository.save(business);
  }

  getAll() {
    return this.businessRepository.find({});
  }

  getById(id: string) {
    const business = this.businessRepository.findOneBy({ id });
    if (!business) {
      throw new NotFoundException(`Business not found`);
    }
    return business;
  }
}
