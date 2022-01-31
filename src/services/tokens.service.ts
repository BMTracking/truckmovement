"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import { generateToken } from './../utils/jwt.utils';
import DbService from "moleculer-db";
import ApiGateway from "moleculer-web";
import UserModel from '././../orm/models/user.model';
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import TokenEntity from "./../orm/entities/token.entity";
import TokenEntityManager from "././../orm/entitymanagers/token.entity.manager";
import { token } from "../config/db";
import { TOKEN_EXPIRATION, TOKEN_TYPES } from "../config/const";

/**
 * @name - Token Service
 * @description - Manage token for JWT authentication
 */
export default class TokenService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "token",
            version: 1,
			aliases:"token",
			adapter:new TypeOrmDbAdapter(token("token")),
			mixins: [DbService],
			model: TokenEntity,
			dependencies: [
			],
			afterConnected() {
				console.log("TokenService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				fields: [/*"id", */"type:", "token", "owner", "expiry",  "createdAt", "lastUsedAt"],
				idField: false,//'id',
			},
			hooks: {
				before: {
					/**
					 * Register a before hook for the `create` action.
					 * It sets a default value for the quantity field.
					 *
					 * @param {Context} ctx
					 */
					create: (ctx: Context<{createdAt:any}>) => {
						//ctx.params.createdAt = new Date();
					},
				},
				after: {
					get: [
					  // Arrow function as a Hook
					  (ctx:any, res:any) => {
						// Remove sensitive data
						return res;
					  }
					]
				  }
			},
			actions:{
				/**
				 * Generate token
				 *
				 * @actions
				 * @param {String} type - Token's type
				 * @param {Number} expiry - Token's live time
				 * @param {String} owner - Owner of the token (JSON String of user entity)
				 *
				 * @returns {Object} token
				 */
                generate: {
                    visibility: "public",
					params: {
                        type: {
                            type: "enum",
                            values: TOKEN_TYPES
                        },
                        expiry: { type: "number", integer: true, optional: true },
                        owner: { type: "string" }
					},
                    async handler(ctx: Context<{
						type: string,
						owner: string,
						expiry: number,
					}>):Promise<any>{
                        const user:UserModel = JSON.parse(ctx.params.owner);
                        const key = await generateToken(user);
                        const token:TokenEntity = await new TokenEntityManager(this.adapter).create({
                            type:ctx.params.type,
                            owner:user.id,
                            expiry:Date.now() + (ctx.params.expiry?ctx.params.expiry:TOKEN_EXPIRATION),
                            token:key
                        });
                        return {token:key, expiry:token.expiry};
                    }
                },
				/**
                * Check a token exist & not expired.
				 *
				 * @actions
				 * @param {String} type - Token's type
				 * @param {String} token - Token's value
				 * @param {String} owner - Owner of the token (JSON String of user entity)
				 * @param {Boolean} isUsed - True if the token is used for session authentication
				 *
				 * @returns {Object} token
				 */
                check: {
                    visibility: "public",
                   params: {
                        type: {
                            type: "enum",
                            values: TOKEN_TYPES
                        },
                        token: { type: "string" },
                        owner: { type: "string", optional: true },
                        isUsed: { type: "boolean", default: false }
                   },
                   async handler(ctx: Context<{
                        type: string, 
                        token: string, 
                        owner: string, 
                        isUsed: boolean
                    }>):Promise<any>{
                       return  await new TokenEntityManager(this.adapter).check(ctx.params.type, ctx.params.token, ctx.params.owner, ctx.params.isUsed)
                    }
                },
				/**
                 * Remove an invalidated token
				 *
				 * @actions
				 * @param {String} type - Token's type
				 * @param {String} token - Token's value
				 *
				 * @returns {Null}
				 */
                remove: {
                    visibility: "public",
                    params: {
                        type: {
                            type: "enum",
                            values: TOKEN_TYPES
                        },
                        token: { type: "string" }
                    },
                    async handler(ctx: Context<{
                        type:string,
                        token: string
                        }>):Promise<any>{
                            await new TokenEntityManager(this.adapter).delete(ctx.params.type, ctx.params.token);
                            return null;
                     }
                },
				/**
                 * Clear expired tokens.
				 *
				 * @actions
				 *
				 * @returns {Null}
				 */
                clearExpired: {
                    visibility: "public",
                    async handler(ctx):Promise<any>{  
						const token:TokenEntity = await new TokenEntityManager(this.adapter).deleteExpired();
                        return null;
                    }
                }
            }
		});
	}
}
