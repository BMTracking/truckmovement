import "reflect-metadata";
import RequestDocEntity from "../entities/request-doc.entity";
import RequestDocModel from "../models/request-doc.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name RequestDoc Entity Manager
 */
export default class RequestDocEntityManager{
    private orm:TypeOrmDbAdapter<RequestDocEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<RequestDocEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns RequestDocEntity
     */
    public async create(data:RequestDocModel):Promise<RequestDocEntity>{
        const item = new RequestDocEntity();
        item.request_id = data.request_id;
        item.customer_id = data.customer_id;
        item.name = data.name;
        item.path = data.path;
        item.mime = data.mime;
        item.size = data.size;
        item.doctype_id = data.doctype_id;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @param customer_id 
     * @returns Null
     */
    public async delete(id:string|number, customer_id:string|number):Promise<any>{
        const where:any = {};
        if(customer_id)
            where.customer_id = customer_id;
        where.id = id;
        const item =  await this.orm.repository.findOneOrFail({
            where:where
        });
        item.deletedAt = new Date();
        await this.orm.repository.softRemove(item);
        return null;
    }
    /**
     * 
     * @param id 
     * @param customer_id 
     * @returns RequestDocEntity
     */
    public async find(id:string|number, customer_id?:string|number):Promise<RequestDocEntity>{
        const where:any = {};
        if(customer_id)
            where.customer_id = customer_id;
        where.id = id;
        const item = await this.orm.repository.findOneOrFail(where);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param customer_id 
     * @param request_id 
     * @param doctype_id 
     * @returns RequestDocEntity[]
     */
    public async search(filter:string, offset:number, page:number, customer_id?:string|number, request_id?:number, doctype_id?:number):Promise<RequestDocEntity[]>{
        const where:any = {};
        if(customer_id)
            where.customer_id = customer_id;
        if(request_id)
            where.request_id = request_id;
        if(doctype_id)
            where.doctype_id = doctype_id;
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
     * @param customer_id 
     * @param request_id 
     * @param doctype_id 
     * @returns [RequestDocEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, customer_id?:string|number, request_id?:number, doctype_id?:number):Promise<[RequestDocEntity[], number]>{
        const where:any = {};
        if(customer_id)
            where.customer_id = customer_id;
        if(request_id)
            where.request_id = request_id;
        if(doctype_id)
            where.doctype_id = doctype_id;
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
     * @param customer_id 
     * @param request_id 
     * @param doctype_id 
     * @returns Number
     */
    public async count(filter:string, customer_id?:string|number, request_id?:number, doctype_id?:number):Promise<number>{
        const where:any = {};
        if(customer_id)
            where.customer_id = customer_id;
        if(request_id)
            where.request_id = request_id;
        if(doctype_id)
            where.doctype_id = doctype_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }
    
}