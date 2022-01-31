import "reflect-metadata";
import DoctypeEntity from "../entities/doctype.entity";
import DoctypeModel from "../models/doctype.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name Doctype Entity Manager
 */
export default class DoctypeEntityManager{
    private orm:TypeOrmDbAdapter<DoctypeEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<DoctypeEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns DoctypeEntity
     */
    public async create(data:DoctypeModel):Promise<DoctypeEntity>{
        const item = new DoctypeEntity();
        item.description = data.description;
        item.name = data.name;
        item.country_id = data.country_id;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns DoctypeEntity
     */
    public async update(data:DoctypeModel):Promise<DoctypeEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.description = data.description && data.description!=null?data.description:item.description;
        item.name = data.name && data.name!=null?data.name:item.name;
        item.country_id = data.country_id && data.country_id!=null?data.country_id:item.country_id;
        
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
     * @returns DoctypeEntity
     */
    public async find(id:string|number):Promise<DoctypeEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param country_id 
     * @returns DoctypeEntity[]
     */
    public async search(filter:string, offset:number, page:number, country_id?:number):Promise<DoctypeEntity[]>{
        const where:any = {};
        if(country_id)
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
     * @returns [DoctypeEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, country_id?:number):Promise<[DoctypeEntity[], number]>{
        const where:any = {};
        if(country_id)
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
     * @returns Number
     */
    public async count(filter:string, country_id?:number):Promise<number>{
        const where:any = {};
        if(country_id)
            where.country_id = country_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }
    
}