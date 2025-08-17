import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from 'entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('This user already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userService.createUser(createUserDto, hashedPassword);

    return await this.userService.saveUser(user);
  }

  private async getTokens(user: any) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const tokens = await this.getTokens(user);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefresh);

    return tokens;
  }

  async verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('No refresh token stored');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    const hashedNew = await bcrypt.hash(newRefreshToken, 10);
    await this.userService.updateRefreshToken(userId, hashedNew);

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }
}
