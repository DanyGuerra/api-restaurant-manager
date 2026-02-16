import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { UserWithoutPassword } from 'src/types/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    try {
      const { email, password, username } = createUserDto;

      const existingUser = await this.userService.findByEmail(email);
      const existingUsername = await this.userService.findByUsername(username);

      if (existingUser) {
        throw new ConflictException('This email already exists');
      }

      if (existingUsername) {
        throw new ConflictException('This username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = uuidv4();

      const user = this.userService.createUser({ ...createUserDto, verification_token: token }, hashedPassword);

      const savedUser = await this.userService.saveUser(user);

      await this.mailService.sendUserConfirmation(savedUser, token);

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }
    await this.userService.markEmailAsVerified(user.id);
  }

  async resendVerification(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.is_verified) {
      throw new BadRequestException('User already verified');
    }

    const token = uuidv4();
    await this.userService.update(user.id, { verification_token: token });
    await this.mailService.sendUserConfirmation(user, token);

    return { message: 'Verification email resent' };
  }

  private async getTokens(user: any) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: UserWithoutPassword) {
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

    return { accessToken: accessToken, refreshToken: newRefreshToken };
  }

  async removeRefreshToken(userId: string) {
    this.userService.updateRefreshToken(userId, '');
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid current password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updateUserPassword(userId, hashedPassword);

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiration

    await this.userService.saveResetToken(user.id, token, expires);
    await this.mailService.sendPasswordReset(user, token);

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (user.reset_password_expires && new Date() > user.reset_password_expires) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUserPassword(user.id, hashedPassword);
    await this.userService.clearResetToken(user.id);

    return { message: 'Password has been reset successfully' };
  }
}
