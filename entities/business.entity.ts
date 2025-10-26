import { UserBusinessRole } from './user-business-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ProductGroup } from './product-group.entity';
import { Exclude } from 'class-transformer';
import { OptionGroup } from './option-group.entity';
import { Order } from './order.entity';

@Entity('business')
@Index(['name', 'owner'], { unique: true })
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Exclude()
  @ManyToOne(() => User, (user) => user.ownedBusinesses, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => UserBusinessRole, (ur) => ur.business)
  userRoles: UserBusinessRole[];

  @OneToMany(() => ProductGroup, (productGroup) => productGroup.business)
  productGroup: ProductGroup[];

  @OneToMany(() => OptionGroup, (optionGroup) => optionGroup.business, {
    cascade: true,
  })
  optionGroups: OptionGroup[];

  @OneToMany(() => Order, (order) => order.business)
  orders: Order[];
}
