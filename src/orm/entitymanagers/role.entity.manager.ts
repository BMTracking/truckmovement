import "reflect-metadata";
import * as fs from 'fs';
import RoleEntity from "../entities/role.entity";
import RoleModel from "../models/role.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name Role Entity Manager
 */
export default class RoleEntityManager{
    private orm:TypeOrmDbAdapter<RoleEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<RoleEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns RoleEntity
     */
    public async create(data:RoleModel):Promise<RoleEntity>{
        const item = new RoleEntity();
        item.name = data.name;
        item.description = data.description;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns RoleEntity
     */
    public async update(data:RoleModel):Promise<RoleEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.description = data.description && data.description!=null?data.description:item.description;
        item.name = data.name && data.name!=null?data.name:item.name;
        
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @returns RoleEntity
     */
    public async delete(id:string|number):Promise<RoleEntity>{
        const role =  await this.orm.repository.findOneOrFail(id);
        role.deletedAt = new Date();
        await this.orm.repository.softRemove(role);
        return role;
    }
    /**
     * 
     * @param id 
     * @returns RoleEntity
     */
    public async find(id:string|number):Promise<RoleEntity>{
        const item = await this.orm.repository.findOneOrFail( id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @returns RoleEntity[]
     */
    public async search(filter:string, offset:number, page:number):Promise<RoleEntity[]>{
        let where:any = [];
        if(filter != null && filter.length > 0){
            where =[
                {name : TypeOrm.ILike(`%${filter}%`)},
                {description : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.find({
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
     * @returns <[RoleEntity[],number]
     */
    public async searchAndCount(filter:string, offset:number, page:number):Promise<[RoleEntity[],number]>{
        let where:any = [];
        if(filter != null && filter.length > 0){
            where =[
                {name : TypeOrm.ILike(`%${filter}%`)},
                {description : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.findAndCount({
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
     * @returns Number
     */
    public async count(filter:string):Promise<number>{
        let where:any = [];
        if(filter != null && filter.length > 0){
            where =[
                {name : TypeOrm.ILike(`%${filter}%`)},
                {description : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    private async testExists(id:string){
        return await this.orm.repository.findOne(id);
    }
    /**
     * 
     */
    public init(){
        console.log("Init installing Roles");
        const roles = JSON.parse(fs.readFileSync('./src/assets/data/role.json', 'utf8'));
        roles.forEach(async (role:any) => {
            if(!await this.testExists(role.id)){
                const item = new RoleEntity();
                item.id = role.actionName;
                item.name = role.name;
                item.description = role.description;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
    }
}