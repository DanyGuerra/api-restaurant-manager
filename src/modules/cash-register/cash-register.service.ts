import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, DataSource } from 'typeorm';
import { CashRegister } from 'entities/cash-register.entity';
import { CashRegisterTransaction, TransactionType } from 'entities/cash-register-transaction.entity';
import { Business } from 'entities/business.entity';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';

@Injectable()
export class CashRegisterService {
    constructor(
        @InjectRepository(CashRegister)
        private readonly cashRegisterRepository: Repository<CashRegister>,
        @InjectRepository(CashRegisterTransaction)
        private readonly transactionRepository: Repository<CashRegisterTransaction>,
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        private readonly dataSource: DataSource,
    ) { }

    async getCashRegisterEntity(businessId: string): Promise<CashRegister> {
        let register = await this.cashRegisterRepository.findOne({
            where: { business: { id: businessId } },
        });

        if (!register) {
            const business = await this.businessRepository.findOne({ where: { id: businessId } });
            if (!business) {
                throw new NotFoundException('Business not found');
            }

            register = this.cashRegisterRepository.create({
                business,
                balance: 0,
            });
            await this.cashRegisterRepository.save(register);
        }

        return register;
    }

    async getCashRegister(
        businessId: string,
        page: number = 1,
        limit: number = 10,
        sort: 'ASC' | 'DESC' = 'DESC',
        start_date?: Date,
        end_date?: Date,
        type?: TransactionType,
    ): Promise<any> {
        const register = await this.getCashRegisterEntity(businessId);

        const where: any = { cash_register: { id: register.id } };

        if (type) {
            where.type = type;
        }

        if (start_date && end_date) {
            where.created_at = Between(start_date, end_date);
        } else if (start_date) {
            where.created_at = MoreThanOrEqual(start_date);
        } else if (end_date) {
            where.created_at = LessThanOrEqual(end_date);
        }

        const [transactions, total] = await this.transactionRepository.findAndCount({
            where,
            relations: ['order'],
            order: { created_at: sort },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            ...register,
            transactions: {
                data: transactions,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async addMoney(businessId: string, addMoneyDto: AddMoneyDto): Promise<any> {
        const registerData = await this.getCashRegisterEntity(businessId);

        await this.dataSource.transaction(async (manager) => {
            const register = await manager.findOne(CashRegister, {
                where: { id: registerData.id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!register) throw new NotFoundException('Cash Register not found');

            const previous_balance = Number(register.balance);
            const amount = Number(addMoneyDto.amount);
            const new_balance = previous_balance + amount;

            register.balance = new_balance;
            await manager.save(CashRegister, register);

            const transaction = manager.create(CashRegisterTransaction, {
                cash_register: register,
                type: TransactionType.ADD,
                amount: amount,
                previous_balance: previous_balance,
                new_balance: new_balance,
                description: addMoneyDto.description,
                order: addMoneyDto.order_id ? ({ id: addMoneyDto.order_id } as any) : null,
            });

            await manager.save(CashRegisterTransaction, transaction);
        });

        return this.getCashRegister(businessId);
    }

    async withdrawMoney(businessId: string, withdrawMoneyDto: WithdrawMoneyDto): Promise<any> {
        const registerData = await this.getCashRegisterEntity(businessId);

        await this.dataSource.transaction(async (manager) => {
            const register = await manager.findOne(CashRegister, {
                where: { id: registerData.id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!register) throw new NotFoundException('Cash Register not found');

            const previous_balance = Number(register.balance);
            const amount = Number(withdrawMoneyDto.amount);

            if (previous_balance < amount) {
                throw new BadRequestException('Insufficient funds in the cash register');
            }

            const new_balance = previous_balance - amount;

            register.balance = new_balance;
            await manager.save(CashRegister, register);

            const transaction = manager.create(CashRegisterTransaction, {
                cash_register: register,
                type: TransactionType.WITHDRAW,
                amount: amount,
                previous_balance: previous_balance,
                new_balance: new_balance,
                description: withdrawMoneyDto.description,
                order: withdrawMoneyDto.order_id ? ({ id: withdrawMoneyDto.order_id } as any) : null,
            });

            await manager.save(CashRegisterTransaction, transaction);
        });

        return this.getCashRegister(businessId);
    }
}
