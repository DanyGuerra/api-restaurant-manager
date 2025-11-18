import { OptionGroup } from 'entities/option-group.entity';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Unique } from 'typeorm';
import { Product } from './product.entity';

@Unique(['product_id', 'option_group_id'])
@Entity('product_option_groups')
export class ProductOptionGroup {
  @PrimaryColumn('uuid')
  product_id: string;

  @PrimaryColumn('uuid')
  option_group_id: string;

  @ManyToOne(() => Product, (product) => product.product_group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(
    () => OptionGroup,
    (optionGroup) => optionGroup.product_option_groups,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'option_group_id' })
  option_group: OptionGroup;
}
