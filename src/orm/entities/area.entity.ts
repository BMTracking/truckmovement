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

@Entity("area")
@Index(["country_id","name", "deletedAt"],{ unique: true })
@Index(["country_id","code", "deletedAt"],{ unique: true })
export default class AreaEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("name")
  public name!: string;

  @Column()
  @Length(255)
  @IsNotEmpty()
  @Index("code")
  public code!: string;

  @Column()
  @IsNotEmpty()
  @Index("country_id")
  //public country_id!: ObjectID;
  public country_id!: number;

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