import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Label } from './label.entity';

@Entity('order_labels')
export class OrderLabel {
  @PrimaryColumn('uuid', { name: 'order_id' })
  order_id: string;

  @PrimaryColumn('uuid', { name: 'label_id' })
  label_id: string;

  @ManyToOne(() => Order, (order) => order.orderLabels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Label, (label) => label.orderLabels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'label_id' })
  label: Label;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;
}
