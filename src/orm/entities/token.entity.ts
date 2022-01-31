import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length, IsEmail, IsPhoneNumber, isNotEmpty } from 'class-validator';

import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity("token")
export default class TokenEntity{

  @Column({name:"token"})
  @IsNotEmpty()
  @Length(255)
  @PrimaryColumn()
  //@Index("token", {unique:true})
  public token: string;

  @Column({ name:"type"})
  @IsNotEmpty()
  @Length(32)
  @Index("type", {unique:false})
  public type: string;

  @Column({name:"owner"})
  @IsNotEmpty()
  @Index("owner", {})
  public owner: string;
  
  @Column({name:"expiry"})
  @IsNotEmpty()
  @Index("expiry")
  public expiry: number;

  @Column({name:"createdAt"})
  @CreateDateColumn()
  public createdAt!: Date;
  
  @Column({name:"lastUsedAt"})
  public lastUsedAt?: Date;
}