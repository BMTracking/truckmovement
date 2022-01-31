import "reflect-metadata";
import * as fs from 'fs';
import CountryEntity from "../entities/country.entity";
import CountryModel from "../models/country.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";

/**
 * @name Country Entity Manager
 */
export default class CountryEntityManager{
    private orm:TypeOrmDbAdapter<CountryEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<CountryEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns CountryEntity
     */
    public async create(data:CountryModel):Promise<CountryEntity>{
        const item = new CountryEntity();
        item.code = data.code;
        item.name = data.name;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns CountryEntity
     */
    public async update(data:CountryModel):Promise<CountryEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.code = data.code && data.code!=null?data.code:item.code;
        item.name = data.name && data.name!=null?data.name:item.name;
        
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
     * @returns CountryEntity
     */
    public async find(id:string|number):Promise<CountryEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @returns CountryEntity[]
     */
    public async search(filter:string, offset:number, page:number):Promise<CountryEntity[]>{
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
     * @returns [CountryEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number):Promise<[CountryEntity[], number]>{
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
     * @returns Number
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
        console.log("Init installing Countries");
        const countries = JSON.parse(fs.readFileSync('./src/assets/data/country.json', 'utf8'));
        countries.forEach(async (country:any) => {
            if(!await this.testExists(country.code)){
                const item = new CountryEntity();
                item.id = country.id;
                item.name = country.name;
                item.code = country.code;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
    }
    
}