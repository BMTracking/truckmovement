import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';

@Entity("permission")
@Index(["service", "path", "deletedAt"],{ unique: true })
export default class PermissionEntity{

  //@ObjectIdColumn()
  @PrimaryColumn({name:"id", type:"varchar"})
  //public id!: ObjectID;
  public id: string;

  @Column()
  @Length(255)
  @IsNotEmpty()
  public service!: string;

  @Column()
  @Length(255)
  @IsNotEmpty()
  public path!: string;

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