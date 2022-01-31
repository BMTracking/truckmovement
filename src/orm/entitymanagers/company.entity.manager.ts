import "reflect-metadata";
import CompanyEntity from "../entities/company.entity";
import CompanyModel from "../models/company.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";

/**
 * @name Company Entity Manager
 */
export default class CompanyEntityManager{
    private orm:TypeOrmDbAdapter<CompanyEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<CompanyEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns CompanyEntity
     */
    public async create(data:CompanyModel):Promise<CompanyEntity>{
        const item = new CompanyEntity();
        item.niu = data.niu;
        item.name = data.name;
        item.type = data.type;
        item.user_id = data.user_id;
        item.activity_id = data.activity_id;
        item.country_id = data.country_id;
        item.area_id = data.area_id;
        item.city_id = data.city_id;   
        item.bank_id = data.bank_id??null;
        item.bank_code = data.bank_code??null;
        item.bank_key = data.bank_key??null;
        item.bank_doc = data.bank_doc??null;
        item.email = data.city_id;
        item.phone1 = data.city_id;
        item.phone2 = data.phone2??null;
        item.address1 = data.address1;
        item.address2 = data.address2??null;
        item.pobox = data.pobox??null;
        item.website = data.website??null;
        item.longitude = data.longitude??null;
        item.latitude = data.latitude??null;        
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param data 
     * @returns CompanyEntity
     */
    public async update(data:CompanyModel, item?:CompanyEntity):Promise<CompanyEntity>{
        if(!item)
            item = await this.orm.repository.findOneOrFail(data.id);
        
        item.niu = data.niu && data.niu!=null?data.niu:item.niu;
        item.name = data.name && data.name!=null?data.name:item.niu;
        item.type = data.type && data.type!=null?data.type:item.type;
        item.activity_id = data.activity_id && data.activity_id!=null?data.activity_id:item.activity_id;
        item.country_id = data.country_id && data.country_id!=null?data.country_id:item.country_id;
        item.area_id = data.area_id && data.area_id!=null?data.area_id:item.area_id;
        item.city_id = data.city_id && data.city_id!=null?data.city_id:item.city_id;   
        item.bank_id = data.bank_id && data.bank_id!=null?data.bank_id:item.bank_id;
        item.bank_code = data.bank_code && data.bank_code!=null?data.bank_code:item.bank_code;
        item.bank_key = data.bank_key && data.bank_key!=null?data.bank_key:item.bank_key;
        item.bank_doc = data.bank_doc && data.bank_doc!=null?data.bank_doc:item.bank_doc;
        item.email =data.email && data.email!=null?data.email:item.email;
        item.phone1 = data.phone1 && data.phone1!=null?data.phone1:item.phone1;
        item.phone2 = data.phone2 && data.phone2!=null?data.phone2:item.phone2;
        item.address1 = data.address1 && data.address1!=null?data.address1:item.address1;
        item.address2 = data.address2 && data.address2!=null?data.address2:item.address2;
        item.pobox = data.pobox && data.pobox!=null?data.pobox:item.pobox;
        item.website = data.website && data.website!=null?data.website:item.website;
        item.longitude = data.longitude && data.longitude!=null?data.longitude:item.longitude;
        item.latitude = data.latitude && data.latitude!=null?data.latitude:item.latitude;     
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
     * @returns CompanyEntity
     */
    public async find(id:string|number):Promise<CompanyEntity>{
        const item = await this.orm.repository.findOneOrFail(id);
        return item;
    }
    /**
     * 
     * @param user_id 
     * @returns CompanyEntity
     */
    public async findByUserId(user_id:number):Promise<CompanyEntity>{
        const item = await this.orm.repository.findOneOrFail({
            user_id:user_id
        });
        return item;
    }
    /**
     * 
     * @param email 
     * @returns CompanyEntity
     */
    public async findByEmail(email:string):Promise<CompanyEntity>{
        const item = await this.orm.repository.findOneOrFail({
            email:email
        });
        return item;
    }
    /**
     * 
     * @param niu 
     * @returns CompanyEntity
     */
    public async findByNiu(niu:string):Promise<CompanyEntity>{
        const item = await this.orm.repository.findOneOrFail({
            niu:niu
        });
        return item;
    }
    /**
     * 
     * @param filter 
     * @param offset 
     * @param page 
     * @param type 
     * @param city_id 
     * @param area_id 
     * @param country_id 
     * @returns CompanyEntity[]
     */
    public async search(filter:string, offset:number, page:number, type?:number, city_id?:number, area_id?:number, country_id?:number):Promise<CompanyEntity[]>{
        const where:any = {};
        if(city_id && city_id != null)
            where.city_id = city_id;
        if(area_id && area_id  != null)
            where.area_id = area_id;
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(type && type  != null)
            where.type = type;
        if(filter != null && filter.length > 0){
            where.name = [
                {name:TypeOrm.ILike(`%${filter}%`)},
                {address1:TypeOrm.ILike(`%${filter}%`)},
                {address2:TypeOrm.ILike(`%${filter}%`)},
                {email:TypeOrm.ILike(`%${filter}%`)},
                {phone1:TypeOrm.ILike(`%${filter}%`)},
                {phone2:TypeOrm.ILike(`%${filter}%`)},
                {pobox:TypeOrm.ILike(`%${filter}%`)},
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
     * @param type 
     * @param city_id 
     * @param area_id 
     * @param country_id 
     * 
     * @returns [CompanyEntity[], number]
     */
    public async searchAndCount(filter:string, offset:number, page:number, type?:number, city_id?:number, area_id?:number, country_id?:number):Promise<[CompanyEntity[], number]>{
        const where:any = {};
        if(city_id && city_id != null)
            where.city_id = city_id;
        if(area_id && area_id  != null)
            where.area_id = area_id;
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(type && type  != null)
        where.type = type;
        if(filter != null && filter.length > 0){
            where.name = [
                {name:TypeOrm.ILike(`%${filter}%`)},
                {address1:TypeOrm.ILike(`%${filter}%`)},
                {address2:TypeOrm.ILike(`%${filter}%`)},
                {email:TypeOrm.ILike(`%${filter}%`)},
                {phone1:TypeOrm.ILike(`%${filter}%`)},
                {phone2:TypeOrm.ILike(`%${filter}%`)},
                {pobox:TypeOrm.ILike(`%${filter}%`)},
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
     * @param type 
     * @param city_id 
     * @param area_id 
     * @param country_id 
     * @returns Number
     */
    public async count(filter:string, type?:number, city_id?:number, area_id?:number, country_id?:number):Promise<number>{
        const where:any = {};
        if(city_id && city_id != null)
            where.city_id = city_id;
        if(area_id && area_id  != null)
            where.area_id = area_id;
        if(country_id && country_id  != null)
            where.country_id = country_id;
        if(filter != null && filter.length > 0){
            where.name = [
                {name:TypeOrm.ILike(`%${filter}%`)},
                {address1:TypeOrm.ILike(`%${filter}%`)},
                {address2:TypeOrm.ILike(`%${filter}%`)},
                {email:TypeOrm.ILike(`%${filter}%`)},
                {phone1:TypeOrm.ILike(`%${filter}%`)},
                {phone2:TypeOrm.ILike(`%${filter}%`)},
                {pobox:TypeOrm.ILike(`%${filter}%`)},
            ];
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