import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'entities/business.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { UsersModule } from '../users/users.module';
import { UserBusinessRolesModule } from '../user-business-role/user-business-role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, UserBusinessRole]),
    UsersModule,
    UserBusinessRolesModule,
  ],
  providers: [BusinessService],
  exports: [],
  controllers: [BusinessController],
})
export class BusinessModule {}
