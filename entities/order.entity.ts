// src/entities/Order.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderItemGroup } from './order-item-group.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  customer_name: string;

  @ManyToOne(() => Business, (business) => business.orders, { nullable: false })
  business: Business;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  total: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ default: false })
  paid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduled_at: Date;

  @Column({ type: 'varchar', default: 'dine_in' })
  consumption_type: string;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderItemGroup, (group) => group.order, { cascade: true })
  itemGroups: OrderItemGroup[];
}
