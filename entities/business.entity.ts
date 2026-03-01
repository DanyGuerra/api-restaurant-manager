import { UserBusinessRole } from './user-business-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ProductGroup } from './product-group.entity';
import { Exclude } from 'class-transformer';
import { OptionGroup } from './option-group.entity';
import { Order } from './order.entity';
import { CashRegister } from './cash-register.entity';

@Entity('business')
@Index(['name', 'owner'], { unique: true, where: 'deleted_at IS NULL' })
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, name: 'street' })
  street: string;

  @Column({ nullable: true, name: 'neighborhood' })
  neighborhood: string;

  @Column({ nullable: true, name: 'city' })
  city: string;

  @Column({ nullable: true, name: 'state' })
  state: string;

  @Column({ nullable: true, name: 'zip_code' })
  zipCode: string;

  @Column({ nullable: true, name: 'phone' })
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ name: 'owner_id' })
  owner_id: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.ownedBusinesses, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => UserBusinessRole, (ur) => ur.business, { cascade: true })
  userRoles: UserBusinessRole[];

  @OneToMany(() => ProductGroup, (productGroup) => productGroup.business, {
    cascade: true,
  })
  product_group: ProductGroup[];

  @OneToMany(() => OptionGroup, (optionGroup) => optionGroup.business, {
    cascade: true,
  })
  option_groups: OptionGroup[];

  @OneToMany(() => Order, (order) => order.business, { cascade: true })
  orders: Order[];

  @OneToOne(() => CashRegister, (cashRegister) => cashRegister.business, {
    cascade: true,
  })
  cash_register: CashRegister;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
