import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { CashRegister } from './cash-register.entity';
import { Order } from './order.entity';

export enum TransactionType {
    ADD = 'ADD',
    WITHDRAW = 'WITHDRAW',
}

@Entity('cash_register_transaction')
export class CashRegisterTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CashRegister, (register) => register.transactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'cash_register_id' })
    cash_register: CashRegister;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    previous_balance: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    new_balance: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @Column({ type: 'uuid', nullable: true })
    order_id: string;

    @ManyToOne(() => Order, { nullable: true, createForeignKeyConstraints: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
