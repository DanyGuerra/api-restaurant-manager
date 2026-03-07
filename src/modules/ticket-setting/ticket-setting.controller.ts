import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';
import { TicketSettingService } from './ticket-setting.service';
import { UpdateTicketSettingDto } from './dto/update-ticket-setting.dto';

@Controller('ticket-setting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketSettingController {
    constructor(private readonly ticketSettingService: TicketSettingService) { }

    @Get()
    @Roles(RolName.OWNER, RolName.ADMIN, RolName.WAITER)
    async getSettings(@BusinessIdHeader() businessId: string) {
        return this.ticketSettingService.getByBusinessId(businessId);
    }

    @Put()
    @Roles(RolName.OWNER, RolName.ADMIN)
    async updateSettings(
        @BusinessIdHeader() businessId: string,
        @Body() updateDto: UpdateTicketSettingDto,
    ) {
        return this.ticketSettingService.update(businessId, updateDto);
    }
}
