import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersRepository.update(userId, { refreshToken });
  }

  // async removeRefreshToken(userId: string) {
  //   await this.usersRepository.update(userId, { refreshToken: null });
  // }

  createUser(user: CreateUserDto, hashedPassword: string) {
    return this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
  }
  saveUser(user: User) {
    return this.usersRepository.save(user);
  }
}
