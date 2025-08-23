import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { instanceToPlain } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return instanceToPlain(user);
  }
}
