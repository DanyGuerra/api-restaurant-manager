import { Business } from './business.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// 58mm, 80mm, 112mm
export type TicketPaperSize = 58 | 80 | 112;
export type TicketFontSize = 0.3 | 0.5 | 0.7 | 1.0 | 1.5 | 2.0;

@Entity('ticket_setting')
export class TicketSetting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', enum: [58, 80, 112], default: 58 })
    paper_size: TicketPaperSize;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
    font_size: TicketFontSize;

    @Column({ default: true })
    show_notes: boolean;

    @Column({ default: true })
    show_customer_info: boolean;

    @Column({ default: true })
    show_business_address: boolean;

    @Column({ default: true })
    show_thank_you_message: boolean;

    @Column({ default: 'Thank you for choosing us!' })
    thank_you_message: string;

    @Column({ default: true })
    show_info_message: boolean;

    @Column({ default: 'Please keep this ticket for any questions' })
    info_message: string;

    @Column({ default: true })
    show_phone: boolean;

    @Column({ default: true })
    show_cashier: boolean;

    @Column({ name: 'business_id' })
    business_id: string;

    @Exclude()
    @OneToOne(() => Business, (business) => business.ticket_setting, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'business_id' })
    business: Business;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at: Date;
}
