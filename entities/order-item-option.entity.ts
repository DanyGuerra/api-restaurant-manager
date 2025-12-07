import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ProductOption } from './product-option.entity';

@Entity('order_item_options')
export class OrderItemOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.options, {
    nullable: false,
  })
  orderItem: OrderItem;

  @ManyToOne(
    () => ProductOption,
    (productOption) => productOption.orderItemOptions,
    { nullable: false },
  )
  productOption: ProductOption;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  price: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
