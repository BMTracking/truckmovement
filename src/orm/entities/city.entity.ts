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

@Entity("city")
@Index(["country_id","name", "deletedAt"],{ unique: true })
export default class CityEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(255)
  @IsNotEmpty()
  @Index("name")
  public name!: string;

  @Column()
  @IsNotEmpty()
  @Index("country_id")
  //public country_id!: ObjectID;
  public country_id: number;
  
  @Column()
  @IsNotEmpty()
  @Index("area_id")
  //public area_id!: ObjectID;
  public area_id: number;

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