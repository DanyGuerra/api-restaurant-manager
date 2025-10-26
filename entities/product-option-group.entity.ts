import { OptionGroup } from 'entities/option-group.entity';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Unique(['product_id', 'option_group_id'])
@Entity('product_option_groups')
export class ProductOptionGroup {
  @PrimaryColumn('uuid')
  product_id: string;

  @PrimaryColumn('uuid')
  option_group_id: string;

  @ManyToOne(() => Product, (product) => product.productGroup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(
    () => OptionGroup,
    (optionGroup) => optionGroup.product_option_groups,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'option_group_id' })
  option_group: OptionGroup;
}
