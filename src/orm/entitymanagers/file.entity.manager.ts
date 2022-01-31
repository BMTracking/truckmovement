import "reflect-metadata";
import FileEntity from "../entities/file.entity";
import FileModel from "../models/file.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as TypeOrm from "typeorm";
/**
 * @name File Entity Manager
 */
export default class FileEntityManager{
    private orm:TypeOrmDbAdapter<FileEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<FileEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns FileEntity
     */
    public async create(data:FileModel, owner:string):Promise<FileEntity>{
        const item = new FileEntity();
        item.owner = owner;
        item.name = data.name;
        item.path = data.path;
        item.mime = data.mime;
        item.size = data.size;
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
}