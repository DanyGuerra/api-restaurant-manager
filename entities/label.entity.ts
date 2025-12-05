import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { OrderLabel } from './order-label.entity';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, { nullable: true })
  @JoinColumn({ name: 'business_id' })
  @Index()
  business?: Business;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  color?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @OneToMany(() => OrderLabel, (orderLabel) => orderLabel.label)
  orderLabels?: OrderLabel[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
