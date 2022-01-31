import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length, IsEmail, IsPhoneNumber, isNotEmpty } from 'class-validator';

import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import RoleEntity from './role.entity';

@Entity("user")
@Index(["login", "deletedAt"], { unique: true })
@Index(["email", "deletedAt"], { unique: true })
export default class UserEntity{

  //@ObjectIdColumn()
  @PrimaryGeneratedColumn()
  //public id!: ObjectID;
  public id: number;

  @Column({name:"role_id"})
  @IsNotEmpty()
  @Index("role_id", {})
  //public role_id!: ObjectID;
  public role_id: number;

/*
  @IsNotEmpty()
  @ManyToOne(() => RoleEntity, role => role.users)
  public role?: RoleEntity;*/

  @Column({name:"login"})
  @Length(255)
  @IsNotEmpty()
  public login!: string;

  @Column({ name:"password" ,select: true })
  @Length(255)
  @IsNotEmpty()
  public password!: string;

  @Column({name:"name"})
  @Length(255)
  @IsNotEmpty()
  public name!: string;

  @Column({name:"email"})
  @Length(255)
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @Column({name:"company_id", nullable: true})
  @Index("company_id", {})
  public company_id!: number;

  @Column({name:"phone", nullable: true})
  @Length(32)
  @IsPhoneNumber()
  public phone!: string;

  @Column({name:"address", nullable: true})
  @Length(255)
  public address!: string;
  
  @Column({name:"verified"})
  public verified!: boolean; 

  @Column({name:"active"})
  public active!: boolean; 

  @Column({name:"createdAt"})
  @CreateDateColumn()
  public createdAt!: Date;

  @Column({name:"updatedAt"})
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column({name:"deletedAt"})
  @DeleteDateColumn()
  public deletedAt?: Date;

  public static hashPassword(pwd:string){
    return bcrypt.hashSync(pwd, 8);
  }

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public comparePasswordDiff(newpassord:string){
    if(this.checkIfUnencryptedPasswordIsValid(newpassord)){
      throw new EvalError("New password must be different of old password");
    }
  }

  public comparePasswordSame(newpassord:string){
    if(!this.checkIfUnencryptedPasswordIsValid(newpassord)){
      throw new EvalError("Invalide password");
    }
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compare(unencryptedPassword, this.password);
  }
}