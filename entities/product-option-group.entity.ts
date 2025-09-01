import { OptionGroup } from 'entities/option-group.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_option_groups')
export class ProductOptionGroup {
  @PrimaryColumn('uuid')
  product_id: string;

  @PrimaryColumn('uuid')
  option_group_id: string;

  @Column({ type: 'int', default: 0 })
  min_options: number;

  @Column({ type: 'int', default: 1 })
  max_options: number;

  @Column({ type: 'int', nullable: true })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @ManyToOne(() => Product, (product) => product.productGroup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

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
