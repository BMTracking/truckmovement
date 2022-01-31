import "reflect-metadata";
import AreaEntity from "../entities/area.entity";
import AreaModel from "../models/area.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
import * as fs from 'fs';
/**
 * @name Area Entity Manager
 */
export default class AreaEntityManager{
    private orm:TypeOrmDbAdapter<AreaEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<AreaEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns AreaEntity
     */
    public async create(data:AreaModel):Promise<AreaEntity>{
        const item = new AreaEntity();
        item.code = data.code;
        item.name = data.name;
        item.country_id = data.country_id;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns AreaEntity
     */
    public async update(data:AreaModel):Promise<AreaEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.code = data.code && data.code != null?data.code:item.code;
        item.name = data.name && data.name != null?data.name:item.name;
        item.country_id = data.country_id && data.country_id != null?data.country_id:item.country_id;
       
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @returns Null
     */
    public async delete(id:string|number):Promise<any>{
        const item =  await this.orm.repository.findOneOrFail(id);
        item.deletedAt = new Date();
        await this.orm.repository.softRemove(item);
        return null;
    }
    /**
     * 
     * @param id 
     * @returns AreaEntity
     */
    public async find(id:string|number):Promise<AreaEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param country_id 
     * @returns AreaEntity[]
     */
    public async search(filter:string, offset:number, page:number, country_id?:number):Promise<AreaEntity[]>{
        const where:any = {};
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
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
     * @param country_id 
     * @returns [AreaEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, country_id?:number):Promise<[AreaEntity[], number]>{
        const where:any = {};
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
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
     * @param country_id 
     * @returns number
     */
    public async count(filter:string, country_id?:number):Promise<number>{
        const where:any = {};
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
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
    private async testExists(code:string){
        return await this.orm.repository.findOne({
            where:{
                code:code
            }
        });
    }
    /**
     * 
     */
    public init(){
        console.log("Init installing Areas");
        const areas = JSON.parse(fs.readFileSync('./src/assets/data/area.json', 'utf8'));
        areas.forEach(async (area:any) => {
            if(!await this.testExists(area.code)){
                const item = new AreaEntity();
                item.id = area.id;
                item.name = area.name;
                item.code = area.code;
                item.country_id = area.country_id;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
    }
    
}