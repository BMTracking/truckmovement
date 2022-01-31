import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity("company")
@Index(["email", "deletedAt"],{ unique: true })
@Index(["niu", "deletedAt"],{ unique: true })
export default class CompanyEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column()
  @Length(255)
  @IsNotEmpty()
  public niu: string;

  @Column()
  @Length(128)
  @IsNotEmpty()
  @Index(["name"])
  public name!: string;

  @Column()
  @IsNotEmpty()
  @Index("user_id")
  //public area_id!: ObjectID;
  public user_id: number;

  @Column()
  @IsNotEmpty()
  @Index("type")
  //public type!: ObjectID;
  public type: number;

  @Column()
  @IsNotEmpty()
  @Index("activity_id")
  //public area_id!: ObjectID;
  public activity_id: number;

  @Column()
  @IsNotEmpty()
  @Index("country_id")
  //public country_id!: ObjectID;
  public country_id!: number;
  
  @Column()
  @IsNotEmpty()
  @Index("area_id")
  //public area_id!: ObjectID;
  public area_id: number;
  
  @Column()
  @IsNotEmpty()
  @Index("city_id")
  //public city_id!: ObjectID;
  public city_id: number;

  @Column({name:"bank_id", nullable: false})
  @IsNotEmpty()
  @Index("bank_id")
  //public area_id!: ObjectID;
  public bank_id: number;

  @Column({name:"email"})
  @Length(255)
  @IsEmail()
  @IsNotEmpty()
  public email!: string;
  
  @Column({name:"phone1", nullable: false})
  @Length(32)
  @IsPhoneNumber()
  public phone1!: string;
  
  @Column({name:"phone2", nullable: true})
  @Length(32)
  @IsPhoneNumber()
  public phone2!: string;

  @Column({name:"address1", nullable: true})
  @Length(255)
  public address1!: string;

  @Column({name:"address2", nullable: true})
  @Length(255)
  public address2!: string;

  @Column({name:"pobox", nullable: true})
  @Length(255)
  public pobox!: string;

  @Column({name:"website", nullable: true})
  @Length(255)
  public website!: string;

  @Column({name:"longitude", nullable: true, type:"double"})
  @Length(255)
  public longitude!: number;

  @Column({name:"latitude", nullable: true, type:"double"})
  @Length(255)
  public latitude!: number;

  @Column({name:"bank_code", nullable: true})
  @Length(255)
  public bank_code!: string;

  @Column({name:"bank_key", nullable: true})
  @Length(16)
  public bank_key!: string;

  @Column({name:"bank_doc", nullable: true})
  @Length(16)
  public bank_doc!: string;

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