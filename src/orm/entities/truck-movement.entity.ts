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

@Entity("truck_movement")
export default class TruckMovementEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("registration")
  public registration!: string;

  @Column()
  @IsNotEmpty()
  @Index("type")
  public type!: number;

  @Column()
  @IsNotEmpty()
  @Index("mobilemoney_type")
  public mobilemoney_type!: number;

  @Column()
  @IsNotEmpty()
  @Length(4, 128)
  @Index("mobilemoney_id")
  public mobilemoney_id!: string;

  @Column("date", {name:"date_in"})
  @IsNotEmpty()
  @Index("date_in")
  public date_in!: Date;
  
  @Column("time", {name:"time_in"})
  @IsNotEmpty()
  @Index("time_in")
  public time_in!: Date;

  @Column()
  @IsNotEmpty()
  @Index("weight")
  public weight!: number;
  
  @Column()
  @IsNotEmpty()
  @Index("amount")
  public amount!: number;

  @Column("date", {name:"date_out"})
  @IsNotEmpty()
  @Index("date_out")
  public date_out!: Date;
  
  @Column("time", {name:"time_out"})
  @IsNotEmpty()
  @Index("time_out")
  public time_out!: Date;

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