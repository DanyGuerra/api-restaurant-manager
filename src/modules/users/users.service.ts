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

  async updateRefreshToken(userId: string, refreshToken: string | undefined) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return;

    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }

  createUser(user: CreateUserDto, hashedPassword: string) {
    return this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
  }

  async updateUserPassword(userId: string, hashedPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) return;

    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }

  saveUser(user: User) {
    return this.usersRepository.save(user);
  }
}
