import "reflect-metadata";
import ActivityEntity from "../entities/activity.entity";
import ActivityModel from "../models/activity.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";

/**
 * @name Activity Entity Manager
 */
export default class ActivityEntityManager{
    private orm:TypeOrmDbAdapter<ActivityEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<ActivityEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns ActivityEntity
     */
    public async create(data:ActivityModel):Promise<ActivityEntity>{
        const item = new ActivityEntity();
        item.description = data.description;
        item.name = data.name;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns 
     */
    public async update(data:ActivityModel):Promise<ActivityEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.description = data.description && data.description != null?data.description:item.description;
        item.name = data.name && data.name != null?data.name:item.name;
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @returns Null
     */
    public async delete(id:string|number):Promise<any>{
        const item =  await this.orm.repository.findOneOrFail( id);
        item.deletedAt = new Date();
        await this.orm.repository.softRemove(item);
        return null;
    }
    /**
     * 
     * @param id 
     * @returns ActivityEntity
     */
    public async find(id:string|number):Promise<ActivityEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @returns ActivityEntity[]
     */
    public async search(filter:string, offset:number, page:number):Promise<ActivityEntity[]>{
        const where:any = {};
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
     * @returns [ActivityEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number):Promise<[ActivityEntity[], number]>{
        const where:any = {};
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
     * @returns number
     */
    public async count(filter:string):Promise<number>{
        const where:any = {};
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.count({
            where:where,
            order:{
                name:"ASC"
            }
        }); 
        return data;
    }
    
}