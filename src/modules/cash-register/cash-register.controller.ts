import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CashRegisterService } from './cash-register.service';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';
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
    getCashRegister(@BusinessIdHeader() businessId: string) {
        return this.cashRegisterService.getCashRegister(businessId);
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
