import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { OrderItemOption } from './order-item-option.entity';
import { OrderItemGroup } from './order-item-group.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: false,
  })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_ready: boolean;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  item_total: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => OrderItemOption, (option) => option.orderItem, {
    cascade: true,
  })
  options: OrderItemOption[];

  @ManyToOne(() => OrderItemGroup, (group) => group.items, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'order_item_group_id' })
  group: OrderItemGroup;
}
