import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductOptionGroup } from './product-option-group.entity';
import { Business } from './business.entity';

@Entity('option_groups')
export class OptionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ej: Size, Type

  @ManyToOne(() => Business, (business) => business.product_group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ type: 'int', default: 0 })
  min_options: number;

  @Column({ type: 'int', default: 1 })
  max_options: number;

  @Column({ type: 'int', nullable: true })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @OneToMany(() => ProductOption, (option) => option.group)
  options: ProductOption[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToMany(() => ProductOptionGroup, (pog) => pog.option_group)
  product_option_groups: ProductOptionGroup[];
}
