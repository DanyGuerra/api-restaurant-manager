import { Controller, Get, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from '../../types/roles';
import { BusinessIdHeader } from '../../decorator/business-id/business-id.decorator';
import { ParseDatePipe } from '../../common/pipes/parse-date.pipe';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('sales')
    @Roles(RolName.OWNER, RolName.ADMIN)
    getSales(
        @BusinessIdHeader() businessId: string,
        @Query('start_date', new ParseDatePipe()) start_date?: Date,
        @Query('end_date', new ParseDatePipe()) end_date?: Date,
        @Query('top_limit') top_limit?: string,
    ) {
        return this.statsService.getSales(businessId, start_date, end_date, top_limit ? parseInt(top_limit, 10) : 5);
    }

    @Get('daily-sales')
    @Roles(RolName.OWNER, RolName.ADMIN)
    getDailySales(
        @BusinessIdHeader() businessId: string,
        @Query('start_date', new ParseDatePipe()) start_date?: Date,
        @Query('end_date', new ParseDatePipe()) end_date?: Date,
    ) {
        return this.statsService.getDailySales(businessId, start_date, end_date);
    }
}
