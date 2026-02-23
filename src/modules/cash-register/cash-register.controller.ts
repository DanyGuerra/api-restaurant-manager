import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';
import { TransactionType } from 'entities/cash-register-transaction.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolName } from 'src/types/roles';
import { BusinessIdHeader } from 'src/decorator/business-id/business-id.decorator';

@Controller('cash-register')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashRegisterController {
    constructor(private readonly cashRegisterService: CashRegisterService) { }

    @Get()
    @Roles(RolName.OWNER, RolName.ADMIN)
    getCashRegister(
        @BusinessIdHeader() businessId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
        @Query('start_date') start_date?: string,
        @Query('end_date') end_date?: string,
        @Query('type') type?: TransactionType,
    ) {
        return this.cashRegisterService.getCashRegister(
            businessId,
            Number(page),
            Number(limit),
            sort,
            start_date ? new Date(start_date) : undefined,
            end_date ? new Date(end_date) : undefined,
            type,
        );
    }

    @Post('add')
    @Roles(RolName.OWNER, RolName.ADMIN)
    addMoney(
        @BusinessIdHeader() businessId: string,
        @Body() addMoneyDto: AddMoneyDto,
    ) {
        return this.cashRegisterService.addMoney(businessId, addMoneyDto);
    }

    @Post('withdraw')
    @Roles(RolName.OWNER, RolName.ADMIN)
    withdrawMoney(
        @BusinessIdHeader() businessId: string,
        @Body() withdrawMoneyDto: WithdrawMoneyDto,
    ) {
        return this.cashRegisterService.withdrawMoney(businessId, withdrawMoneyDto);
    }
}
