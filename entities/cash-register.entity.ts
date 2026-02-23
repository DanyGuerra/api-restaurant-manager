import { Business } from './business.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { CashRegisterTransaction } from './cash-register-transaction.entity';

@Entity('cash_register')
export class CashRegister {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @OneToOne(() => Business, (business) => business.cash_register, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @OneToMany(() => CashRegisterTransaction, (transaction) => transaction.cash_register, { cascade: true })
    transactions: CashRegisterTransaction[];

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at: Date;
}
