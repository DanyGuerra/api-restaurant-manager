import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { UserBusinessRole } from './user-business-role.entity';
import { Business } from './business.entity';
import { Exclude } from 'class-transformer';
import { Order } from './order.entity';

@Entity('users')
@Index(['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['username'], { unique: true, where: 'deleted_at IS NULL' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @OneToMany(() => Business, (business) => business.owner)
  ownedBusinesses: Business[];

  @OneToMany(() => UserBusinessRole, (ur) => ur.user)
  businessRoles: UserBusinessRole[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
