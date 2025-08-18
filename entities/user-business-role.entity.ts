import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';
import { Role } from './role.entity';

@Entity('user_business_roles')
export class UserBusinessRole {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn('uuid')
  business_id: string;

  @PrimaryColumn('int')
  role_id: number;

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
