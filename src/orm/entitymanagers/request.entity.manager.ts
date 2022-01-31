import "reflect-metadata";
import RequestEntity from "../entities/request.entity";
import RequestModel from "../models/request.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name Request Entity Manager
 */
export default class RequestEntityManager{
    private orm:TypeOrmDbAdapter<RequestEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<RequestEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns RequestEntity
     */
    public async create(data:RequestModel):Promise<RequestEntity>{
        const item = new RequestEntity();
        item.transporter_id = data.transporter_id;
        item.customer_id = data.customer_id;
        item.delivery_date = data.delivery_date;
        item.drop_date = data.drop_date;
        item.marchandise = data.marchandise;
        item.transit = data.transit;
        //drop
        item.from_country_id = data.from_country_id;
        item.from_area_id = data.from_area_id;
        item.from_city_id = data.from_city_id;
        item.from_address = data.from_address;
        item.from_country_id = data.from_country_id;
        item.from_longitude = data.from_longitude??null;
        item.from_lattitude = data.from_lattitude??null;
        //delivery
        item.to_country_id = data.to_country_id;
        item.to_area_id = data.to_area_id;
        item.to_city_id = data.to_city_id;
        item.to_address = data.to_address;
        item.to_country_id = data.to_country_id;
        item.to_longitude = data.to_longitude??null;
        item.to_lattitude = data.to_lattitude??null;
        item.status = data.status;

        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns RequestEntity
     */
    public async update(data:RequestModel, customer_id?:string|number):Promise<RequestEntity>{
        const where:any = {
            id:data.id
        };
        if(customer_id && customer_id != null)
            where.customer_id = customer_id;
        const item =  await this.orm.repository.findOneOrFail({
            where:where
        });
        item.transporter_id = data.transporter_id && data.transporter_id != null?data.transporter_id:item.transporter_id;
        item.delivery_date = data.delivery_date && data.delivery_date != null?data.delivery_date:item.delivery_date;
        item.drop_date = data.drop_date && data.drop_date != null?data.drop_date:item.drop_date;
        item.marchandise = data.marchandise && data.marchandise != null?data.marchandise:item.marchandise;
        item.transit = data.transit && data.transit != null?data.transit:item.transit;
        //drop
        item.from_country_id = data.from_country_id && data.from_country_id != null?data.from_country_id:item.from_country_id;
        item.from_area_id = data.from_area_id && data.from_area_id != null?data.from_area_id:item.from_area_id;
        item.from_city_id = data.from_city_id && data.from_city_id != null?data.from_city_id:item.from_city_id;
        item.from_address = data.from_address && data.from_address != null?data.from_address:item.from_address;
        item.from_country_id = data.from_country_id && data.from_country_id != null?data.from_country_id:item.from_country_id;
        item.from_longitude = data.from_longitude && data.from_longitude != null?data.from_longitude:item.from_longitude;
        item.from_lattitude = data.from_lattitude && data.from_lattitude != null?data.from_lattitude:item.from_lattitude;
        //delivery
        item.to_country_id = data.to_country_id && data.to_country_id != null?data.to_country_id:item.to_country_id;
        item.to_area_id = data.to_area_id && data.to_area_id != null?data.to_area_id:item.to_area_id;
        item.to_city_id = data.to_city_id && data.to_city_id != null?data.to_city_id:item.to_city_id;
        item.to_address = data.to_address && data.to_address != null?data.to_address:item.to_address;
        item.to_country_id = data.to_country_id && data.to_country_id != null?data.to_country_id:item.to_country_id;
        item.to_longitude = data.to_longitude && data.to_longitude != null?data.to_longitude:item.to_longitude;
        item.to_lattitude = data.to_lattitude && data.to_lattitude != null?data.to_lattitude:item.to_lattitude;
        item.status = data.status && data.status != null?data.status:item.status;

        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @param customer_id 
     * @returns Null
     */
    public async delete(id:string|number, customer_id?:string|number):Promise<any>{
        const where:any = {};
        if(customer_id && customer_id != null)
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
     * @returns RequestEntity
     */
    public async find(id:string|number, customer_id?:string|number):Promise<RequestEntity>{
        const where:any = {};
        if(customer_id && customer_id != null)
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
     * @param transporter_id 
     * @returns RequestEntity[]
     */
    public async search(filter:string, offset:number, page:number, customer_id?:string|number, transporter_id?:number):Promise<RequestEntity[]>{
        const where:any = {};
        if(customer_id && customer_id != null)
            where.customer_id = customer_id;
        if(transporter_id&& transporter_id!= null)
            where.request_id = transporter_id;
        const data =  await this.orm.repository.find({
            where:where,
            order:{
                drop_date:"ASC"
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
     * @param transporter_id 
     * @returns [RequestEntity, Number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, customer_id?:string|number, transporter_id?:number):Promise<[RequestEntity[], number]>{
        const where:any = {};
        if(customer_id && customer_id != null)
            where.customer_id = customer_id;
        if(transporter_id&& transporter_id!= null)
            where.request_id = transporter_id;
        const data =  await this.orm.repository.findAndCount({
            where:where,
            order:{
                drop_date:"ASC"
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
     * @param transporter_id 
     * @returns Number
     */
    public async count(filter:string, customer_id?:string|number, transporter_id?:number):Promise<number>{
        const where:any = {};
        if(customer_id && customer_id != null)
            where.customer_id = customer_id;
        if(transporter_id&& transporter_id!= null)
            where.request_id = transporter_id;
        if(filter != null && filter.length > 0){
            where.name = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }
    
}