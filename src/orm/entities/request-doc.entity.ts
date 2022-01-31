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

@Entity("request_doc")
export default class RequestDocEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @IsNotEmpty()
  @Index("customer_id")
  //public customer_id!: ObjectID;
  public customer_id!: number;

  @Column()
  @IsNotEmpty()
  @Index("request_id")
  //public request_id!: ObjectID;
  public request_id!: number;

  @Column()
  @IsNotEmpty()
  @Index("doctype_id")
  //public doctype_id!: ObjectID;
  public doctype_id!: number;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("name")
  public name!: string;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("path")
  public path!: string;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("mime")
  public mime!: string;

  @Column()
  @Length(4, 128)
  @IsNotEmpty()
  @Index("size")
  public size!: number;
  
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