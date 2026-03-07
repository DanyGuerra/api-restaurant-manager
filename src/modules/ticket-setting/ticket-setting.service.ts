import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketSetting } from 'entities/ticket-setting.entity';
import { UpdateTicketSettingDto } from './dto/update-ticket-setting.dto';

@Injectable()
export class TicketSettingService {
    constructor(
        @InjectRepository(TicketSetting)
        private readonly ticketSettingRepository: Repository<TicketSetting>,
    ) { }

    async getByBusinessId(businessId: string): Promise<TicketSetting> {
        let setting = await this.ticketSettingRepository.findOne({
            where: { business_id: businessId },
        });

        if (!setting) {
            setting = this.ticketSettingRepository.create({ business_id: businessId });
            setting = await this.ticketSettingRepository.save(setting);
        }

        return setting;
    }

    async update(businessId: string, updateDto: UpdateTicketSettingDto): Promise<TicketSetting> {
        let setting = await this.ticketSettingRepository.findOne({
            where: { business_id: businessId },
        });

        if (!setting) {
            setting = this.ticketSettingRepository.create({
                business_id: businessId,
                ...updateDto,
            });
        } else {
            Object.assign(setting, updateDto);
        }

        return this.ticketSettingRepository.save(setting);
    }
}
