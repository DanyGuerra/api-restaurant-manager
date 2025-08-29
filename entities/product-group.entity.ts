import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Business } from './business.entity';
import { Product } from './product.entity';

@Entity('product_groups')
export class ProductGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  business_id: string;

  @ManyToOne(() => Business, (business) => business.productGroup)
  business: Business;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.productGroup)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
