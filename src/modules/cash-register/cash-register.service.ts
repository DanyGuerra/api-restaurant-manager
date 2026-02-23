import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
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
        const register = await this.getCashRegisterEntity(businessId);

        const transaction = this.transactionRepository.create({
            cash_register: register,
            type: TransactionType.ADD,
            amount: addMoneyDto.amount,
            description: addMoneyDto.description,
            order: addMoneyDto.order_id ? { id: addMoneyDto.order_id } as any : null,
        });

        register.balance = Number(register.balance) + Number(addMoneyDto.amount);

        // Ensure bidirectional relationship is established
        if (!register.transactions) {
            register.transactions = [];
        }
        register.transactions.push(transaction);

        await this.transactionRepository.save(transaction);
        await this.cashRegisterRepository.save(register);

        return this.getCashRegister(businessId);
    }

    async withdrawMoney(businessId: string, withdrawMoneyDto: WithdrawMoneyDto): Promise<any> {
        const register = await this.getCashRegisterEntity(businessId);

        if (Number(register.balance) < Number(withdrawMoneyDto.amount)) {
            throw new BadRequestException('Insufficient funds in the cash register');
        }

        const transaction = this.transactionRepository.create({
            cash_register: register,
            type: TransactionType.WITHDRAW,
            amount: withdrawMoneyDto.amount,
            description: withdrawMoneyDto.description,
            order: withdrawMoneyDto.order_id ? { id: withdrawMoneyDto.order_id } as any : null,
        });

        // Update balance
        register.balance = Number(register.balance) - Number(withdrawMoneyDto.amount);

        // Ensure bidirectional relationship is established
        if (!register.transactions) {
            register.transactions = [];
        }
        register.transactions.push(transaction);

        await this.transactionRepository.save(transaction);
        await this.cashRegisterRepository.save(register);

        return this.getCashRegister(businessId);
    }
}
