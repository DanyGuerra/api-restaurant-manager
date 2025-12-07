import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_item_groups')
export class OrderItemGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.itemGroups, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order: Order;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  subtotal: number;

  @OneToMany(() => OrderItem, (item) => item.group, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
