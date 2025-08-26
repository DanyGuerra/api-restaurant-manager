import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { UserBusinessRolesController } from './user-business-role.controller';
import { UserBusinessRolesService } from './user-business-role.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserBusinessRole]), RolesModule],
  controllers: [UserBusinessRolesController],
  providers: [UserBusinessRolesService],
  exports: [UserBusinessRolesService],
})
export class UserBusinessRolesModule {}
