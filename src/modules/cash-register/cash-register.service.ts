import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async getCashRegister(businessId: string): Promise<CashRegister> {
        let register = await this.cashRegisterRepository.findOne({
            where: { business: { id: businessId } },
            relations: ['transactions', 'transactions.order'],
            order: {
                transactions: {
                    created_at: 'DESC'
                }
            }
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
            register.transactions = [];
        }

        return register;
    }

    async addMoney(businessId: string, addMoneyDto: AddMoneyDto): Promise<CashRegister> {
        const register = await this.getCashRegister(businessId);

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

        return this.cashRegisterRepository.findOne({
            where: { id: register.id },
            relations: ['transactions'],
            order: { transactions: { created_at: 'DESC' } }
        }) as Promise<CashRegister>;
    }

    async withdrawMoney(businessId: string, withdrawMoneyDto: WithdrawMoneyDto): Promise<CashRegister> {
        const register = await this.getCashRegister(businessId);

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

        return this.cashRegisterRepository.findOne({
            where: { id: register.id },
            relations: ['transactions'],
            order: { transactions: { created_at: 'DESC' } }
        }) as Promise<CashRegister>;
    }
}
