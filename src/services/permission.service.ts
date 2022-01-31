"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import PermissionEntityManager from "./../orm/entitymanagers/permission.entity.manager";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import PermissionEntity from "./../orm/entities/permission.entity";

/**
 * @name - Permission Service
 * @description - Manage Permissions
 */
export default class PermissionService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "permission",
            version: 1,
			aliases:"permission",
			adapter:new TypeOrmDbAdapter(base("permission")),
			mixins: [DbService],
			model: PermissionEntity,
			async afterConnected() {
				console.log("PermissionService Database connected!!!!");
				// Seed the DB with ˙this.create`
				await new PermissionEntityManager(this.adapter).init();
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"service",
					"path",,
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
				 * Create Permission.
				 *
				 * @actions
				 * @param {String} service - Service name
				 * @param {String} path - Service path
				 *
				 * @returns {Object} - Permission entity
				 */
                 create: {
					description: "Create Permission",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						service:{
							type: "string",
							optional: false,
							require:true
						},
						path:{
							type: "string",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						service: string, 
						path: string,
						}>): Promise<any> {
							const permision = await new PermissionEntityManager(this.adapter).create({
								service:ctx.params.service,
								path:ctx.params.path,
							});
						// Send to all "mail" service instances
						this.broker.broadcast("permission.created", permision, ["permission", "mail"]);
						return Promise.resolve(permision);
					},
				},
				/**
				 * Update Permission.
				 *
				 * @actions
				 * @param {Number} id - Permission Id
				 * @param {String} service - Service name
				 * @param {String} path - Service path
				 *
				 * @returns {Object} - Permission entity
				 */
				update: {
					description: "Update Permission",
					rest: {
						method: "PUT",
						path: "/:id/edit",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						},
						service:{
							type: "string",
							optional: true,
							require:false
						},
						path:{
							type: "string",
							optional: true,
							require:false
						}
					},
					async handler(ctx: Context<{
						id: string, 
						service: string, 
						path: string,
					}>): Promise<any> {
						return Promise.resolve(await new PermissionEntityManager(this.adapter).update({
							id:ctx.params.id,
							service:ctx.params.service??null,
							path:ctx.params.path??null,
						}));
					},
				},
				/**
				 * Remove Permission.
				 *
				 * @actions
				 * @param {Number} id - Permission Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Permission",
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
						const permision = await new PermissionEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("permission.deleted", permision, ["permission", "mail"]);
						return Promise.resolve(null);
					},
				},
				
				/**
				 * List Permission entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Permission entities
				 */
				list: {
					description: "List of permissions",
					rest: {
						method: "GET",
						path: "/list",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: Context<{
						filter: string, 
						offset: number, 
						page: number
					}>): Promise<any> {
						return Promise.resolve(await new PermissionEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and Count Permission entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Permission entities
				 */
				listcount: {
					description: "List and Count permissions",
					rest: {
						method: "GET",
						path: "/listcount",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: Context<{
						filter: string,
						offset: number, 
						page: number
					}>): Promise<any> {
						return Promise.resolve(await new PermissionEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Permission entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of permissions
				 */
				count: {
					description: "Find Permission",
					rest: {
						method: "GET",
						path: "/count",
					},
					params: {
						filter: "string"
					},
					async handler(ctx: Context<{
						filter: string
					}>): Promise<any> {
						return Promise.resolve(await new PermissionEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Permission entity.
				 *
				 * @actions
				 * @param {Number} id - Permission Id
				 *
				 * @returns {Object} - Permission entity
				 */
				 find: {
					description: "Find Permission",
					rest: {
						method: "GET",
						path: "/:id/show",
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
						return Promise.resolve(await new PermissionEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
