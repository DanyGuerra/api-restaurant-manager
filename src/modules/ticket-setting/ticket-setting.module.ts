import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketSetting } from 'entities/ticket-setting.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { TicketSettingService } from './ticket-setting.service';
import { TicketSettingController } from './ticket-setting.controller';
import { UserBusinessRolesModule } from '../user-business-role/user-business-role.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketSetting, UserBusinessRole]),
    UserBusinessRolesModule,
    AuthModule,
  ],
  controllers: [TicketSettingController],
  providers: [TicketSettingService],
  exports: [TicketSettingService],
})
export class TicketSettingModule { }
