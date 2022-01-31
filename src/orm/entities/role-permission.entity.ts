import { IsNotEmpty, Length } from 'class-validator';
import { ObjectID } from 'mongodb';
import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ObjectIdColumn
} from 'typeorm';

@Entity("role_permision")
@Index(["role_id", "permission_id", "deletedAt"], { unique: true })
export default class RolePermissionEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column({name:"role_id"})
  @IsNotEmpty()
  //public role_id!: ObjectID;
  public role_id: number;

  @Column({name:"permission_id", type:"varchar"})
  @IsNotEmpty()
  //public permission_id!: ObjectID;
  public permission_id: string;

  @Column({name:"createdAt"})
  @CreateDateColumn()
  public createdAt!: Date;

  @Column({name:"updatedAt"})
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({name:"deletedAt"})
  @DeleteDateColumn()
  public deletedAt?: Date;
}