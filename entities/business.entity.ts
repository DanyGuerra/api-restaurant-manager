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
import { ProductGroup } from './product-group.entity';
import { Exclude } from 'class-transformer';
import { OptionGroup } from './option-group.entity';

@Entity('business')
@Unique(['name', 'owner_id'])
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Exclude()
  @Column({ nullable: true })
  owner_id: string;

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
}
