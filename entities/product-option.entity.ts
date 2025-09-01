import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OptionGroup } from './option-group.entity';

@Entity('product-options')
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  option_group_id: string;

  @ManyToOne(() => OptionGroup, (group) => group.options)
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
