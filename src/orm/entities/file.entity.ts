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

@Entity("file")
export default class FileEntity{

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
  @Length(4, 128)
  @IsNotEmpty()
  @Index("owner")
  public owner!: string;

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