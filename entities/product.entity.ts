import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ProductGroup } from './product-group.entity';
import { OptionGroup } from './option-group.entity';
import { OrderItem } from './order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductGroup, (productGroup) => productGroup.products)
  @JoinColumn({ name: 'group_product_id' })
  product_group: ProductGroup;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  base_price: number;

  @Column({ default: true })
  available: boolean;

  @ManyToMany(() => OptionGroup)
  @JoinTable({
    name: 'product_option_groups',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_group_id', referencedColumnName: 'id' },
  })
  option_groups: OptionGroup[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
