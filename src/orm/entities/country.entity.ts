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

@Entity("country")
@Index(["name", "deletedAt"],{ unique: true })
@Index(["code", "deletedAt"],{ unique: true })
export default class CountryEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(255)
  @IsNotEmpty()
  public name!: string;

  @Column()
  @Length(255)
  @IsNotEmpty()
  public code!: string;

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