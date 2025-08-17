// import { UserBusinessRole } from './user-business-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  //   @OneToMany(() => UserBusinessRole, (ur) => ur.restaurant)
  //   userRoles: UserBusinessRole[];
}
