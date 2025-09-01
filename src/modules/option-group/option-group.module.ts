import { Module } from '@nestjs/common';
import { OptionGroupController } from './option-group.controller';
import { OptionGroupService } from './option-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroup } from 'entities/option-group.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroup, UserBusinessRole])],
  controllers: [OptionGroupController],
  providers: [OptionGroupService],
})
export class OptionGroupModule {}
