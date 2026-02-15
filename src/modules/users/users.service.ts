import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  saveUser(user: User) {
    return this.usersRepository.save(user);
  }

  async findByVerificationToken(token: string) {
    return this.usersRepository.findOne({ where: { verification_token: token } });
  }

  async markEmailAsVerified(userId: string) {
    await this.usersRepository.update(userId, {
      is_verified: true,
      verification_token: null as any,
    });
  }

  async saveResetToken(userId: string, token: string, expires: Date) {
    await this.usersRepository.update(userId, {
      reset_password_token: token,
      reset_password_expires: expires,
    });
  }

  async findByResetToken(token: string) {
    return this.usersRepository.findOne({ where: { reset_password_token: token } });
  }

  async clearResetToken(userId: string) {
    await this.usersRepository.update(userId, {
      reset_password_token: null as any,
      reset_password_expires: null as any,
    });
  }
}
