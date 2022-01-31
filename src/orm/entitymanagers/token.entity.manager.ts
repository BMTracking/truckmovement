import "reflect-metadata";
import TokenEntity from "../entities/token.entity";
import TokenModel from "../models/token.model";
import { TypeOrmDbAdapter, } from "moleculer-db-adapter-typeorm";
import { LessThanOrEqual } from "typeorm";
import {  secureToken } from './../../utils/jwt.utils';
/**
 * @name Token Entity Manager
 */
export default class TokenEntityManager{
    private orm:TypeOrmDbAdapter<TokenEntity>;

    /**
     * 
     * @param orm 
     */
    public constructor(orm:TypeOrmDbAdapter<TokenEntity>){
        this.orm = orm;
    }
    /**
     * 
     * @param type 
     * @param token 
     * @param owner 
     * @param isUsed 
     * @returns Boolean
     */
    public async check(type:string, token:string, owner:string, isUsed:boolean){
        const entity:TokenEntity = await this.orm.repository.findOneOrFail({
            where: {
                type:type,
                token: secureToken(token)
            }
        });
        if(entity){
            if (entity.expiry && entity.expiry < Date.now()) 
                return false;
            if (!owner || entity.owner == owner) {
                if(isUsed){
                    return this.update(entity);
                }
                return entity;
            }
        }
        return null;
    }
    /**
     * 
     * @param data 
     * @param role 
     * @returns TokenEntity
     */
    public async create(data:TokenModel):Promise<TokenEntity>{
        const token = new TokenEntity();
        token.owner = data.owner;
        token.type = data.type;
        token.expiry = data.expiry;
        token.lastUsedAt = data.lastUsedAt;
        token.token = secureToken(data.token);
        
        token.createdAt = new Date();
        const created = await this.orm.repository.save(token);

        return created;
    }
    /**
     * 
     * @param data 
     * @param role 
     * @returns TokenEntity
     */
    private async update(token:TokenEntity):Promise<TokenEntity>{
        token.lastUsedAt = new Date();
        return await this.orm.repository.save(token);
    }
    /**
     * 
     * @param token 
     * @returns Null
     */
    public async delete(type:string, token:string):Promise<any>{
        await this.orm.repository.delete( {
                type:type,
                token: secureToken(token)
        });
        return null;
    }
    /**
     * 
     * @param token 
     * @returns Null
     */
    public async deleteExpired():Promise<any>{   
        await this.orm.repository.delete( {
            expiry: LessThanOrEqual(Date.now())
        }); 
        return null;
    }
}