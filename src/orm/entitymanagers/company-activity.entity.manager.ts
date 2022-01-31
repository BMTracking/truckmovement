import "reflect-metadata";
import CompanyActivityEntity from "../entities/company-activity.entity";
import CompanyActivityModel from "../models/company-activity.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
/**
 * @name Role Permission Entity Manager
 */
export default class CompanyActivityEntityManager{
    private orm:TypeOrmDbAdapter<CompanyActivityEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<CompanyActivityEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns CompanyActivityModel
     */
    public async create(data:CompanyActivityModel):Promise<CompanyActivityModel>{
        const item = new CompanyActivityEntity();
        item.company_id = data.company_id;
        item.activity_id = data.activity_id;
        item.createdAt = new Date();
        item.updatedAt = new Date();
        return await this.orm.repository.save(item);
    }
    /**
     * 
     * @param id 
     * @returns Null
     */
    public async delete(id:string|number):Promise<any>{
        const item =  await this.orm.repository.softDelete(id);
        return null;
    }
    /**
     * 
     * @param id 
     * @returns Null
     */
    public async remove(company_id:string|number, activity_id:number|string):Promise<any>{
        const item:CompanyActivityEntity[] =  await this.orm.repository.find({
            where:{
                company_id:company_id,
                activity_id:activity_id,
            }
        });
        await this.orm.repository.softRemove(item);
        return null
    }
    /**
     * 
     * @param activity_id 
     * @returns Null
     */
    public async deleteByActivity(activity_id:string|number):Promise<any>{
        const item:CompanyActivityEntity[] =  await this.orm.repository.find({
            where:{
                activity_id:activity_id
            }
        });
        await this.orm.repository.softRemove(item);
        return null
    }   
    /**
     * 
     * @param company_id 
     * @returns Null
     */
    public async deleteByCompany(company_id:string|number):Promise<any>{
        const item:CompanyActivityEntity[] =  await this.orm.repository.find({
            where:{
                company_id:company_id
            }
        });
        await this.orm.repository.softRemove(item);
        return null
    }   
    /**
     * 
     * @param company_id 
     * @param activity_id 
     * @returns CompanyActivityEntity
     */
    public async find(company_id:number, activity_id:string):Promise<CompanyActivityEntity> {
        const item:CompanyActivityEntity = await this.orm.repository.findOneOrFail({
            where:{
                company_id: company_id,
                activity_id: activity_id,
            }
        });
        return item;
    }
    /**
     * 
     * @param company_id 
     * @returns CompanyActivityEntity[]
     */
    public async search(company_id:string):Promise<CompanyActivityEntity[]> {
        const item:CompanyActivityEntity[] = await this.orm.repository.find({
            where:{
                company_id: company_id,
           },
        });
        return item;
    }
}