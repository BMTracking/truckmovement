import "reflect-metadata";
import CityEntity from "../entities/city.entity";
import CityModel from "../models/city.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
import * as fs from 'fs';

/**
 * @name City Entity Manager
 */
export default class CityEntityManager{
    private orm:TypeOrmDbAdapter<CityEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<CityEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns CityEntity
     */
    public async create(data:CityModel):Promise<CityEntity>{
        const item = new CityEntity();
        item.country_id = data.country_id;
        item.area_id = data.area_id;
        item.name = data.name;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns CityEntity
     */
    public async update(data:CityModel):Promise<CityEntity>{
        const item = await this.orm.repository.findOneOrFail(data.id);
        item.area_id = data.area_id && data.area_id != null?data.area_id:item.area_id;
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
     * @returns CityEntity
     */
    public async find(id:string|number):Promise<CityEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param area_id 
     * @param country_id 
     * @returns CityEntity[]
     */
    public async search(filter:string, offset:number, page:number, area_id?:number, country_id?:number):Promise<CityEntity[]>{
        const where:any = {};
        if(area_id && area_id  != null)
            where.area_id = area_id;
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
     * @param area_id 
     * @param country_id 
     * @returns [CityEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, area_id?:number, country_id?:number):Promise<[CityEntity[], number]>{
        const where:any = {};
        if(area_id && area_id  != null)
            where.area_id = area_id;
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
     * @param area_id 
     * @param country_id 
     * @returns number
     */
    public async count(filter:string, area_id?:number, country_id?:number):Promise<number>{
        const where:any = {};
        if(area_id && area_id  != null)
            where.area_id = area_id;
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
     * @param country_id 
     * @param area_id 
     * @param name 
     * @returns 
     */
    private async testExists(country_id:number,area_id:number, name:string){
        return await this.orm.repository.findOne({
            where:{
                country_id:country_id,
                area_id:area_id,
                name:name,
            }
        });
    }
    /**
     * 
     */
    public init(){
        console.log("Init installing Cities");
        const cities = JSON.parse(fs.readFileSync('./src/assets/data/city.json', 'utf8'));
        cities.forEach(async (city:any) => {
            if(!await this.testExists(city.country_id, city.area_id, city.name)){
                const item = new CityEntity();
                item.name = city.name;
                item.area_id = city.area_id;
                item.country_id = city.country_id;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
    }
    
}