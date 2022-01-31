import "reflect-metadata";
import * as fs from 'fs';
import PermissionEntity from "../entities/permission.entity";
import PermissionModel from "../models/permission.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name Permission Entity Manager
 */
export default class PermissionEntityManager{
    private orm:TypeOrmDbAdapter<PermissionEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<PermissionEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns PermissionEntity
     */
    public async create(data:PermissionModel):Promise<PermissionEntity>{
        const item = new PermissionEntity();
        item.service = data.service;
        item.path = data.path;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns PermissionEntity
     */
    public async update(data:PermissionModel):Promise<PermissionEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.service = data.service && data.service!=null?data.service:item.service;
        item.path = data.path && data.path!=null?data.path:item.path;
        
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @returns PermissionModel
     */
    public async delete(id:string|number):Promise<PermissionModel>{
        const item =  await this.orm.repository.findOneOrFail(id);
        item.deletedAt = new Date();
        await this.orm.repository.softRemove(item);
        return item;
    }
    /**
     * 
     * @param id 
     * @returns PermissionEntity
     */
    public async find(id:string|number):Promise<PermissionEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @returns PermissionEntity[]
     */
    public async search(filter:string, offset:number, page:number):Promise<PermissionEntity[]>{
        let where:any = [];
        if(filter != null && filter.length > 0){
            where =[
                {service : TypeOrm.ILike(`%${filter}%`)},
                {path : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.find({
            where:where,
            order:{
                service:"ASC"
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
     * @returns [PermissionEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number):Promise<[PermissionEntity[], number]>{
        let where:any = [];
        if(filter != null && filter.length > 0){
            where =[
                {service : TypeOrm.ILike(`%${filter}%`)},
                {path : TypeOrm.ILike(`%${filter}%`)},
            ];
        }
        const data =  await this.orm.repository.findAndCount({
            where:where,
            order:{
                service:"ASC"
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
                {service : TypeOrm.ILike(`%${filter}%`)},
                {path : TypeOrm.ILike(`%${filter}%`)},
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
        console.log("Init installing Permissions");
        const permissions = JSON.parse(fs.readFileSync('./src/assets/data/permission.json', 'utf8'));
        permissions.forEach(async (permission:any) => {
            if(permission.actionName != null && !await this.testExists(permission.id)){
                const item = new PermissionEntity();
                item.id = permission.actionName;
                item.service = permission.routePath;
                item.path = permission.path;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
    }
    
}