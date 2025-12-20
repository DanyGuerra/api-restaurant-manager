import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';
import { Role } from './role.entity';

@Entity('user_business_roles')
@Unique(['user_id', 'business_id', 'role_id'])
export class UserBusinessRole {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn('uuid')
  business_id: string;

  @PrimaryColumn('int')
  role_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.businessRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
