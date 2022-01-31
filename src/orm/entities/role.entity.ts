import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PermissionEntity from './permission.entity';
import UserEntity from './user.entity';

@Entity("role")
@Index(["name", "deletedAt"], { unique: true })
export default class RoleEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(128)
  @IsNotEmpty()
  public name!: string;

  @Column()
  @Length(255)
  public description!: string;

/*
  @OneToMany(() => UserEntity, user => user.role)
  public users!: UserEntity[];*/

  @Column({name:"createdAt"})
  @CreateDateColumn()
  public createdAt!: Date;

  @Column({name:"updatedAt"})
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({name:"deletedAt"})
  @DeleteDateColumn()
  public deletedAt?: Date;
/*
  @ManyToMany(() => PermissionEntity)
  @JoinTable()
  public permissions!: PermissionEntity[];*/
}