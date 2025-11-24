import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { sub: string; [key: string]: any };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  async getMyUser(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    const user = await this.userService.findById(userId);
    return instanceToPlain(user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return instanceToPlain(user);
  }

  @Patch('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['sub'];
    const user = await this.userService.update(userId, updateUserDto);
    return instanceToPlain(user);
  }
}
