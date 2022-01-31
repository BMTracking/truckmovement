"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import RolePermissionEntityManager from "./../orm/entitymanagers/role-permission.entity.manager";
import ApiGateway from "moleculer-web";
import RolePermissionEntity from "./../orm/entities/role-permission.entity";
import { USER_SUPERADMIN_GROUP, USER_ADMIN_GROUP } from "../config/const";

/**
 * @name - RolePermission Service
 * @description - Manage authorization and permissions
 */
export default class RolePermissionService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "role-permission",
            version: 1,
			aliases:"rolepermission",
			adapter:new TypeOrmDbAdapter(base("rolepermission")),
			mixins: [DbService],
			model: RolePermissionEntity,
			rest: true,
			async afterConnected() {
				console.log("RolePermissionService Database connected!!!!");
				// Seed the DB with ˙this.create`
				await new RolePermissionEntityManager(this.adapter).init();
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"role_id",
					"permission_id",,
					"createdAt",
					"updatedAt"  
				],
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
						ctx.params.createdAt = new Date();
					},
				},
				after: {
					get: [
					  // Arrow function as a Hook
					  (ctx, res) => {
						// Remove sensitive data
						return res;
					  }
					]
				  }
			},
			events: {
				"permission.created": {
					// Register handler to the "mail" group instead of "payment" group.
					group: "permission",
					async handler(permission:any) {
						console.log("Permission created!!!!!::  ",permission);
						await new RolePermissionEntityManager(this.adapter).create({
							role_id:USER_SUPERADMIN_GROUP,
							permission_id:permission.id
						});
						await new RolePermissionEntityManager(this.adapter).create({
							role_id:USER_ADMIN_GROUP,
							permission_id:permission.id
						});
						return Promise.resolve({});
					}
				},
				"permission.deleted": {
					// Register handler to the "mail" group instead of "payment" group.
					group: "permission",
					async handler(permission:any) {
						console.log("Permission deleted!!!!!::  ",permission);
						await new RolePermissionEntityManager(this.adapter).deleteByPermission(permission.id);
						return Promise.resolve({});
					}
				},
				"role.deleted": {
					// Register handler to the "mail" group instead of "payment" group.
					group: "role",
					async handler(role:any) {
						console.log("Permission deleted!!!!!::  ",role);
						await new RolePermissionEntityManager(this.adapter).deleteByRole(role.id);
						return Promise.resolve({});
					}
				},
			},
			actions:{
				/**
				 * Add new Permission to Role.
				 *
				 * @actions
				 * @param {Number} role_id - Role Id ref
				 * @param {String} permission_id - permission Id ref
				 *
				 * @returns {Object} - RolePermission entity
				 */
				create: {
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						role_id: {
							type: "number",
							optional: false,
							require:true
						},
						permission_id: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
							role_id: number, 
							permission_id: string
						}>): Promise<any> {
							const rolepermission = await new RolePermissionEntityManager(this.adapter).create({
								role_id:ctx.params.role_id,
								permission_id:ctx.params.permission_id
							});
							// Send to all "mail" service instances
							this.broker.broadcast("rolepermission.created", rolepermission, ["mail"]);
							return Promise.resolve(rolepermission);
					},
				},
				/**
				 * Remove Permission to Role.
				 *
				 * @actions
				 * @param {Number} id - Role Id ref
				 *
				 * @returns {Null}
				 */
				revoque: {
					rest: {
						method: "DELETE",
						path: "/:id/revoque",
					},
					params: {
						role_id: {
							type: "number",
							optional: false,
							require:true
						},
						permission_id: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						role_id: string|number,
						permission_id: string|number,
					}>): Promise<any> {
						const rolepermission = await new RolePermissionEntityManager(this.adapter).remove(ctx.params.role_id, ctx.params.permission_id);
						// Send to all "mail" service instances
						this.broker.broadcast("rolepermission.removed", rolepermission, ["mail"]);
						return Promise.resolve(null);
					},
				},
				/**
				 * Remove Permission to Role.
				 *
				 * @actions
				 * @param {Number} id - Role Id ref
				 *
				 * @returns {Null}
				 */
				remove: {
					rest: {
						method: "DELETE",
						path: "/:id/delete",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						id: string|number
					}>): Promise<any> {
						const rolepermission = await new RolePermissionEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("rolepermission.deleted", rolepermission, ["mail"]);
						return Promise.resolve(null);
					},
				},
				/**
				 * Check if Role has permission
				 *
				 * @actions
				 * @param {String} token - Logged user Token
				 * @param {String} role_id - Role Id ref
				 * @param {String} permission_id - Permission Id ref
				 *
				 * @returns {Object} permission
				 */
				 check: {
					visibility: "public",
					cache: {
						keys: ["token"],
						ttl: 60 * 60 // 1 hour
					},
					params: {
						token: {
							type: "string",
							optional: false,
							require:true
						},
						role_id: {
							type: "number",
							optional: false,
							require:true
						},
						permission_id: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						token: string,
						role_id: number,
						permission_id: string,
					}>):Promise<any>{
						const data = await new RolePermissionEntityManager(this.adapter).find(ctx.params.role_id, ctx.params.permission_id);
						if(!data || !data.id || data.id < 1){
							throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.ERR_INVALID_TOKEN, null);
						}			
						return Promise.resolve(data);
					},
				},
			}
		});
	}

}
