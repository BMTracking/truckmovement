import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity("request")
export default class RequestEntity{

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
  @Index("transporter_id")
  //public transporter_id!: ObjectID;
  public transporter_id!: number;

  
  @Column({name:"drop_date"})
  @IsNotEmpty()
  @Index()
  drop_date:Date;   
  
  @Column({name:"delivery_date"})
  @IsNotEmpty()
  @Index()
  delivery_date:Date;  
  
  @Column({name:"marchandise"})
  @IsNotEmpty()
  @Length(255)
  marchandise:string;  
  
  @Column({name:"transit"})
  @IsNotEmpty()
  transit:boolean;  
  
  @Column({name:"from_country_id"})
  @IsNotEmpty()
  @Index("from_country_id")
  from_country_id:number;  
  
  @Column({name:"from_area_id"})
  @IsNotEmpty()
  @Index("from_area_id")
  from_area_id:number;  
  
  @Column({name:"from_city_id"})
  @IsNotEmpty()
  @Index("from_city_id")
  from_city_id:number;
  
  @Column({name:"from_address"})
  @IsNotEmpty()
  @Length(255)
  @Index("from_address")
  from_address:string;  
  
  @Column({name:"from_longitude"})
  @IsEmpty()
  from_longitude?:number;  
  
  @Column({name:"from_lattitude"})
  @IsEmpty()
  from_lattitude?:number;  


  @Column({name:"to_country_id"})
  @IsNotEmpty()
  @Index("to_country_id")
  to_country_id:number;  
  
  @Column({name:"to_area_id"})
  @IsNotEmpty()
  @Index("to_area_id")
  to_area_id:number;  
  
  @Column({name:"to_city_id"})
  @IsNotEmpty()
  @Index("to_city_id")
  to_city_id:number;  
  
  @Column({name:"to_address"})
  @IsNotEmpty()
  @Length(255)
  @Index("to_address")
  to_address:string;  
  
  @Column({name:"to_longitude"})
  @IsEmpty()
  to_longitude:number;  
  
  @Column({name:"to_lattitude"})
  @IsEmpty()
  to_lattitude:number;

  @Column()
  @IsNotEmpty()
  @Index("status")
  public status!: number;
  
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