import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginUserDto,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login(user);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { access_token: tokens.accessToken };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const payload = await this.authService.verifyRefreshToken(refreshToken);

    const userId = payload.sub;

    const tokens = await this.authService.refresh(userId, refreshToken);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return tokens;
  }
}
