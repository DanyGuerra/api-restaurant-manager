import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRegister } from 'entities/cash-register.entity';
import { CashRegisterTransaction } from 'entities/cash-register-transaction.entity';
import { Business } from 'entities/business.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CashRegister,
            CashRegisterTransaction,
            Business,
            UserBusinessRole,
        ]),
    ],
    controllers: [CashRegisterController],
    providers: [CashRegisterService],
    exports: [CashRegisterService],
})
export class CashRegisterModule { }
