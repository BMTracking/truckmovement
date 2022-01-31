"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import RoleEntityManager from "./../orm/entitymanagers/role.entity.manager";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import RoleEntity from "./../orm/entities/role.entity";

/**
 * @name - Role Service
 * @description - Manage User role
 */
export default class RoleService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "role",
            version: 1,
			aliases:"role",
			adapter:new TypeOrmDbAdapter(base("role")),
			mixins: [DbService],
			model: RoleEntity,
			async afterConnected() {
				console.log("RoleService Database connected!!!!");
				await new RoleEntityManager(this.adapter).init();
				// Seed the DB with ˙this.create`
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"name",
					"description",,
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
			actions:{
				/**
				 * Create Role.
				 *
				 * @actions
				 * @param {Number} description - description of Role
				 * @param {String} name - Name of Role
				 *
				 * @returns {Object} - Role entity
				 */
                 create: {
					description: "Create Role",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						name: {
							type: "string",
							optional: false,
							require:true
						},
						description: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						name: string, 
						description: string,
						}>): Promise<any> {
							const role = await new RoleEntityManager(this.adapter).create({
								name:ctx.params.name,
								description:ctx.params.description,
							});
							// Send to all "mail" service instances
							this.broker.broadcast("role.created", role, ["permission", "mail"]);
							return Promise.resolve(role);
					},
				},
				/**
				 * Update Role.
				 *
				 * @actions
				 * @param {Number} id - Role Id
				 * @param {Number} description - description of Role
				 * @param {String} name - Name of Role
				 *
				 * @returns {Object} - Role entity
				 */
				update: {
					description: "Update Role",
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
						description: {
							type: "string",
							optional: true,
							require:false
						},
						name: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
						id: number,
						description: string,
						name: string,
					}>): Promise<any> {
						return Promise.resolve(await new RoleEntityManager(this.adapter).update({
							id:ctx.params.id,
							name:ctx.params.name??null,
							description:ctx.params.description??null,
						}));
					},
				},
				/**
				 * Remove Role.
				 *
				 * @actions
				 * @param {Number} id - Role Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Role",
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
						const role = await new RoleEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("role.deleted", role, ["role", "mail"]);
						return Promise.resolve(null);
					},
				},
				
				/**
				 * List Role entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Role entities
				 */
				list: {
					description: "List of Roles",
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
						return Promise.resolve(await new RoleEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and Count Role entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Role entities
				 */
				listcount: {
					description: "List and Count Roles",
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
						return Promise.resolve(await new RoleEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Role entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of Roles
				 */
				count: {
					description: "Find Role",
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
						return Promise.resolve(await new RoleEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Role entity.
				 *
				 * @actions
				 * @param {Number} id - Role Id
				 *
				 * @returns {Object} - Role entity
				 */
				 find: {
					description: "Find Role",
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
						return Promise.resolve(await new RoleEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
