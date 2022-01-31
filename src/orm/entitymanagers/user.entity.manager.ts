import "reflect-metadata";
import UserEntity from "../entities/user.entity";
import UserModel from "../models/user.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
import * as fs from 'fs';
/**
 * @name User Entity Manager
 */
export default class UserEntityManager{
    private orm:TypeOrmDbAdapter<UserEntity>;

    /**
     * 
     * @param orm 
     */
    public constructor(orm:TypeOrmDbAdapter<UserEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @param role 
     * @returns UserEntity
     */
    public async create(data:UserModel):Promise<UserEntity>{
        const user = new UserEntity();

        user.role_id = data.role_id;
        user.login = data.login;
        user.email = data.email;
        user.name = data.name;
        user.phone = data.phone;
        user.password = data.password;
        user.address = data.address;
        user.active = data.active!;
        
        user.hashPassword();
        user.createdAt = new Date();
        user.updatedAt = new Date();
        
        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param user_id 
     * @returns UserEntity
     */
     public async disable(user:UserEntity):Promise<UserEntity>{
      
        user.active = false;

        user.updatedAt = new Date();

        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param user_id 
     * @returns UserEntity
     */
     public async enable(user:UserEntity):Promise<UserEntity>{
      
        user.active = true;
        
        user.verified = true;

        user.updatedAt = new Date();

        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param data 
     * @param role 
     * @returns UserEntity
     */
    public async update(data:UserModel):Promise<UserEntity>{
        const item = await this.orm.findById(data.id);
      
        item.email = data.email && data.email!=null?data.email:item.email;
        item.name = data.name && data.name!=null?data.name:item.name;
        item.phone = data.phone && data.phone!=null?data.phone:item.phone;
        item.address = data.address && data.address!=null?data.address:item.address;
        item.role_id = data.role_id && data.role_id!=null?data.role_id:item.role_id;
         
        item.updatedAt = new Date();

        const daved:UserEntity = await this.orm.repository.save(item);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param data 
     * @returns UserEntity
     */
    public async updateprofile(data:UserModel):Promise<UserEntity>{
        const user = await this.orm.findById(data.id);

        user.email = data.email;
        user.name = data.name;
        user.phone = data.phone;
        user.address = data.address;

        user.updatedAt = new Date();
        
        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }    
    /**
     * 
     * @param id 
     * @param password 
     * @param user 
     * @returns UserEntity
     */
     public async updatepassword(id:string|number, password: string, user:UserEntity = null):Promise<UserEntity>{
         if(!user)
            user = await this.orm.repository.findOneOrFail(id);

        user.password = password;        
        user.hashPassword();

        user.updatedAt = new Date();
        
        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param id 
     * @param oldpassword 
     * @param newpassord 
     * @param user 
     * @returns UserEntity
     */
     public async updateMypassword(id:string|number, oldpassword:string, newpassord: string, user:UserEntity = null):Promise<UserEntity>{
        if(!user)
           user = await this.orm.repository.findOneOrFail(id);
        user.comparePasswordDiff(newpassord);
        user.comparePasswordSame(oldpassword);
        user.password = newpassord;        
        user.hashPassword();

        user.updatedAt = new Date();
        
        const daved:UserEntity = await this.orm.repository.save(user);
        delete daved.password;
        return daved;
    }
    /**
     * 
     * @param id 
     * @returns UserEntity
     */
    public async delete(id:string|number):Promise<UserEntity>{        
        const item =  await this.orm.repository.findOneOrFail(id);
        item.deletedAt = new Date();
        await this.orm.repository.softRemove(item);
        return item;
    }
    /**
     * 
     * @param id 
     * @returns UserEntity
     */
    public async find(id:string|number):Promise<UserEntity>{
        const user = await this.orm.repository.findOneOrFail({
            where:{
                
            }
        });
        delete user.password;
        return user;
    }
    /**
     * 
     * @param email 
     * @returns UserEntity
     */
    public async findByEmail(email:string):Promise<UserEntity>{
        const user = await this.orm.repository.findOneOrFail({
            where:{
                email:email
            }
        });
        delete user.password;
        return user;
    }
    /**
     * 
     * @param login 
     * @returns UserEntity
     */
    public async findByLogin(login:string):Promise<UserEntity>{
        const user = await this.orm.repository.findOneOrFail({
            where:{
                login:login
            }
        });
        delete user.password;
        return user;
    }
    /**
     * 
     * @param phone 
     * @returns UserEntity
     */
    public async findByPhone(phone:string):Promise<UserEntity>{
        const user = await this.orm.repository.findOneOrFail({
            where:{
                phone:phone
            }
        });
        delete user.password;
        return user;
    }
    /**
     * 
     * @param login 
     * @param password 
     * @returns UserModel
     */
    public async login(login:string|number, password:string):Promise<UserModel> {
        try{
            const tmpuser:UserEntity = await this.orm.repository.findOneOrFail({
                where:{
                    login:login
                }
            });
            if(tmpuser){
                tmpuser.comparePasswordSame(password);
                const user:UserModel = {
                    id:tmpuser.id,
                    role_id:tmpuser.role_id,
                    login:tmpuser.login,
                    email:tmpuser.email,
                    name:tmpuser.name,
                    phone:tmpuser.phone,
                    address:tmpuser.address,
                    active:tmpuser.active,
                    createdAt:tmpuser.createdAt,
                    updatedAt:tmpuser.updatedAt,
                    deletedAt:tmpuser.deletedAt,
                }
                return user;
            }
        }catch(err){
            console.log(err);
        }
        return null;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param role_id 
     * @returns UserModel[]
     */
    public async search(filter:string, offset:number, page:number, role_id?:string):Promise<UserModel[]>{        
        let where:any = {};        
        if(role_id && role_id  != null)
            where.role_id = role_id;
        if(filter != null && filter.length > 0){
            where.login = [
                {login : TypeOrm.ILike(`%${filter}%`)},
                {name : TypeOrm.ILike(`%${filter}%`)},
                {email : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.find({
            select:[ "id", "login", "name", "email", "phone", "address", "active","createdAt", "updatedAt" ],
            where:where,
            order:{
                name:"ASC"
            },
            withDeleted:false,
            skip:(page*offset),
            take:offset*(page*1+1)
        }); 
        return data;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param role_id 
     * @returns [UserModel[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, role_id?:string):Promise<[UserModel[], number]>{        
        let where:any = {};        
        if(role_id && role_id  != null)
            where.role_id = role_id;
        if(filter != null && filter.length > 0){
            where.login = [
                {login : TypeOrm.ILike(`%${filter}%`)},
                {name : TypeOrm.ILike(`%${filter}%`)},
                {email : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.findAndCount({
            select:[ "id", "login", "name", "email", "phone", "address", "active","createdAt", "updatedAt" ],
            where:where,
            order:{
                name:"ASC"
            },
            withDeleted:false,
            skip:(page*offset),
            take:offset*(page*1+1)
        }); 
        return data;
    }
    /**
     * 
     * @param filter 
     * @param role_id 
     * @returns Number
     */
    public async count(filter:string, role_id?:string):Promise<number>{        
        let where:any = {};        
        if(role_id && role_id  != null)
            where.role_id = role_id;
        if(filter != null && filter.length > 0){
            where.login = [
                {login : TypeOrm.ILike(`%${filter}%`)},
                {name : TypeOrm.ILike(`%${filter}%`)},
                {email : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }

    /**
     * 
     * @param code 
     * @returns 
     */
    private async testExists(id:string){
        return await this.orm.repository.findOne(id);
    }
    /**
     * 
     */
    public init(){
        console.log("Init installing Users");
        const roles = JSON.parse(fs.readFileSync('./src/assets/data/user.json', 'utf8'));
        roles.forEach(async (data:any) => {
            if(!await this.testExists(data.id)){
                const user = new UserEntity();
                user.id = data.id;
                user.role_id = data.role_id;
                user.login = data.login;
                user.email = data.email;
                user.name = data.name;
                user.phone = data.phone;
                user.password = data.password;
                user.address = data.address;
                user.active = true;
                user.verified = true;
                
                user.createdAt = new Date();
                user.updatedAt = new Date();
                await this.orm.repository.save(user);
            }
        });        
    }
}