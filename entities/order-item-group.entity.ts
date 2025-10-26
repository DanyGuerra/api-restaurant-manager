// src/entities/OrderItemGroup.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_item_groups')
export class OrderItemGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.itemGroups, { nullable: false })
  order: Order;

  @Column({ type: 'varchar', nullable: true })
  name: string; // Ej: "Caja 1", "Para entrega tardía", etc.

  @OneToMany(() => OrderItem, (item) => item.group, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;
}
