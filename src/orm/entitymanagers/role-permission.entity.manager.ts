import "reflect-metadata";
import RolePermissionEntity from "../entities/role-permission.entity";
import RolePermissionModel from "../models/role-permission.model";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import * as fs from 'fs';
import { USER_ADMIN_GROUP, USER_SUPERADMIN_GROUP } from "../../config/const";
import { getSystemErrorMap } from "util";
/**
 * @name Role Permission Entity Manager
 */
export default class RolePermissionEntityManager{
    private orm:TypeOrmDbAdapter<RolePermissionEntity>;

    /**
     * 
     * @param orm 
     */
     public constructor(orm:TypeOrmDbAdapter<RolePermissionEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param data 
     * @returns RolePermissionModel
     */
    public async create(data:RolePermissionModel):Promise<RolePermissionModel>{
        const item = new RolePermissionEntity();
        item.role_id = data.role_id;
        item.permission_id = data.permission_id;
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
     * @param role_id 
     * @param permission_id 
     * @returns Null
     */
    public async remove(role_id:string|number, permission_id:string|number):Promise<any>{
        const item:RolePermissionEntity[] =  await this.orm.repository.find({
            where:{
                permission_id:permission_id,
                role_id:role_id,
            }
        });
        await this.orm.repository.softRemove(item);
        return null
    }   
    /**
     * 
     * @param role_id 
     * @param permission_id 
     * @returns Null
     */
    public async deleteByPermission(permission_id:string|number):Promise<any>{
        const item:RolePermissionEntity[] =  await this.orm.repository.find({
            where:{
                permission_id:permission_id
            }
        });
        return await this.orm.repository.softRemove(item);
    }
    /**
     * 
     * @param role_id 
     * @returns Null
     */
    public async deleteByRole(role_id:string|number):Promise<any>{
        const item:RolePermissionEntity[] =  await this.orm.repository.find({
            where:{
                role_id:role_id
            }
        });
        await this.orm.repository.softRemove(item);
        return null
    }   
    /**
     * 
     * @param role_id 
     * @param permission_id 
     * @returns RolePermissionEntity
     */
    public async find(role_id:number, permission_id:string):Promise<RolePermissionEntity> {
        const item:RolePermissionEntity = await this.orm.repository.findOneOrFail({
            where:{
                role_id: role_id,
                permission_id: permission_id,
            }
        });
        return item;
    }
    /**
     * 
     * @param role_id 
     * @returns RolePermissionEntity[]
     */
    public async search(role_id:string):Promise<RolePermissionEntity[]> {
        const item:RolePermissionEntity[] = await this.orm.repository.find({
            where:{
                role_id: role_id,
           },
        });
        return item;
    }
    /**
     * 
     * @param role_id 
     * @param permission_id 
     * @returns 
     */
     private async testExists(role_id:number, permission_id:string){
        return await this.orm.repository.findOne({
            where:{
                role_id:role_id,
                permission_id:permission_id
            }
        });
    }
    /**
     * 
     */
    public init(){
        console.log("Init installing Role-Permissions");
        const permissions = JSON.parse(fs.readFileSync('./src/assets/data/permission.json', 'utf8'));
        permissions.forEach(async (permission:any) => {
            if(permission.actionName != null && !await this.testExists(USER_SUPERADMIN_GROUP, permission.actionName)){
                const item = new RolePermissionEntity();
                item.role_id = USER_SUPERADMIN_GROUP;
                item.permission_id = permission.actionName;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });        
        permissions.forEach(async (permission:any) => {
            if(permission.actionName != null && !await this.testExists(USER_ADMIN_GROUP, permission.actionName)){
                const item = new RolePermissionEntity();
                item.role_id = USER_ADMIN_GROUP;
                item.permission_id = permission.actionName;
                item.createdAt = new Date();
                item.updatedAt = new Date();
                await this.orm.repository.save(item);
            }
        });      
    }
}