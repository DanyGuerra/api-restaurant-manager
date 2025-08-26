import { UserBusinessRole } from './user-business-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('business')
@Unique(['name', 'owner_id'])
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  owner_id: string;

  @ManyToOne(() => User, (user) => user.ownedBusinesses, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => UserBusinessRole, (ur) => ur.business)
  userRoles: UserBusinessRole[];
}
