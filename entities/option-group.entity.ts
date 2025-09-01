import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductOptionGroup } from './product-option-group.entity';

@Entity('option_groups')
export class OptionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ej: Size, Type

  @OneToMany(() => ProductOption, (option) => option.group)
  options: ProductOption[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => ProductOptionGroup, (pog) => pog.option_group)
  product_option_groups: ProductOptionGroup[];
}
