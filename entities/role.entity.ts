import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBusinessRole } from './user-business-role.entity';
import { RolName } from 'src/types/roles';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RolName, unique: true })
  name: RolName;

  @OneToMany(() => UserBusinessRole, (ur) => ur.role)
  userRoles: UserBusinessRole[];
}
