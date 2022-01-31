import "reflect-metadata";
import TruckMovementEntity from "../entities/truck-movement.entity";
import TruckMovementModel from "../models/truck-movement.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
import moment from 'moment';
/**
 * @name TruckMovement Entity Manager
 */
export default class TruckMovementEntityManager{
    private orm:TypeOrmDbAdapter<TruckMovementEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<TruckMovementEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns TruckMovementEntity
     */
    public async create(data:TruckMovementModel, format:string):Promise<TruckMovementEntity>{
        const item = new TruckMovementEntity();
        item.registration = data.registration;
        item.date_out = moment(data.date_out, format ).toDate();
        item.date_in =  moment(data.date_in, format).toDate();
        item.time_out = data.time_out;
        item.time_in = data.time_in;
        item.type = data.type;
        item.amount = data.amount;
        item.mobilemoney_type = data.mobilemoney_type;
        item.mobilemoney_id = data.mobilemoney_id;
        item.weight = data.weight;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        //console.log(item);
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns TruckMovementEntity
     */
    public async update(data:TruckMovementModel, format:string):Promise<TruckMovementEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.registration = data.registration && data.registration != null?data.registration:item.registration;
        item.type = data.type && data.type != null?data.type:item.type;
        item.weight = data.weight && data.weight != null?data.weight:item.weight;
        item.amount = data.amount && data.amount != null?data.amount:item.amount;
        item.mobilemoney_type = data.mobilemoney_type && data.mobilemoney_type != null?data.mobilemoney_type:item.mobilemoney_type;
        item.mobilemoney_id = data.mobilemoney_id && data.mobilemoney_id != null?data.mobilemoney_id:item.mobilemoney_id;
        item.date_in = data.date_in && data.date_in != null? moment(data.date_in, format ).toDate():item.date_in;
        item.date_out = data.date_out && data.date_out != null?moment(data.date_out, format ).toDate():item.date_out;
        item.time_in = data.time_in && data.time_in != null?data.time_in:item.time_in;
        item.time_out = data.time_out && data.time_out != null?data.time_out:item.time_out;

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
     * @returns TruckMovementEntity
     */
    public async find(id:string|number):Promise<TruckMovementEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param registration 
     * @returns TruckMovementEntity[]
     */
    public async search(filter:string, offset:number, page:number, registration?:number):Promise<TruckMovementEntity[]>{
        const where:any = {};
        if(registration)
            where.registration = registration;
        if(filter != null && filter.length > 0){
            where.date_in = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.find({
            where:where,
            order:{
                date_in:"ASC"
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
     * @param registration 
     * @returns [TruckMovementEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, registration?:number):Promise<[TruckMovementEntity[], number]>{
        const where:any = {};
        if(registration)
            where.date_out = registration;
        if(filter != null && filter.length > 0){
            where.date_in = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.findAndCount({
            where:where,
            order:{
                date_in:"ASC"
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
     * @param registration 
     * @returns number
     */
    public async count(filter:string, registration?:number):Promise<number>{
        const where:any = {};
        if(registration)
            where.date_out = registration;
        if(filter != null && filter.length > 0){
            where.date_in = TypeOrm.ILike(`%${filter}%`);
        }
        const data =  await this.orm.repository.count({
            where:where
        }); 
        return data;
    }
    
}