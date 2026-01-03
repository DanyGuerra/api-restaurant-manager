import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { OptionGroup } from './option-group.entity';
import { OrderItemOption } from './order-item-option.entity';

@Index(['option_group_id', 'name'], { unique: true, where: 'deleted_at IS NULL' })
@Entity('product_options', { orderBy: { popularity: 'DESC' } })
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  option_group_id: string;

  @ManyToOne(() => OptionGroup, (group) => group.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_group_id' })
  group: OptionGroup;

  @Column()
  name: string; // Example: Large, Medium, Small

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'int', nullable: true, default: 0 })
  popularity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(
    () => OrderItemOption,
    (orderItemOption) => orderItemOption.productOption,
  )
  orderItemOptions: OrderItemOption[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
