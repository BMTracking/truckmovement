"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import ActivityEntityManager from "./../orm/entitymanagers/activity.entity.manager";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import ActivityEntity from "./../orm/entities/activity.entity";

/**
 * @name - Activity Service
 * @description - Manage Activities
 */
export default class ActivityService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "activity",
            version: 1,
			aliases:"activity",
			adapter:new TypeOrmDbAdapter(base("activity")),
			mixins: [DbService],
			model: ActivityEntity,
			afterConnected() {
				console.log("ActivityService Database connected!!!!");
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
					"description",
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
				 * Create Activity.
				 *
				 * @actions
				 * @param {String} description - Description of Activity
				 * @param {String} name - Name of Activity
				 *
				 * @returns {Object} - Activity entity
				 */
                 create: {
					description: "Create Activity",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						description: {
							type: "string",
							optional: false,
							require:true
						},
						name: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						name: string, 
						description: string,
						}>): Promise<any> {
							return Promise.resolve(await new ActivityEntityManager(this.adapter).create({
								name:ctx.params.name,
								description:ctx.params.description,
							}));
					},
				},
				/**
				 * Update Activity.
				 *
				 * @actions
				 * @param {Number} id - Activity Id
				 * @param {String} description - Description of Activity
				 * @param {String} name - Name of Activity
				 *
				 * @returns {Object} - Activity entity
				 */
				update: {
					description: "Update Activity",
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
						id: string, 
						name: string, 
						description: string,
					}>): Promise<any> {
						return Promise.resolve(await new ActivityEntityManager(this.adapter).update({
							id:ctx.params.id,
							name:ctx.params.name??null,
							description:ctx.params.description??null,
						}));
					},
				},
				/**
				 * Remove Activity.
				 *
				 * @actions
				 * @param {Number} id - Activity Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Activity",
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
						const activity = await new ActivityEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("activity.deleted", activity, ["activity", "mail"]);
						return Promise.resolve(null);
					},
				},
				
				/**
				 * List Activity entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Activity entities
				 */
				list: {
					description: "List of Activities",
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
						return Promise.resolve(await new ActivityEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and Count Activity entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Activity entities
				 */
				listcount: {
					description: "List and Count Activities",
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
						return Promise.resolve(await new ActivityEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Activity entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of Activities
				 */
				count: {
					description: "Find Activity",
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
						return Promise.resolve(await new ActivityEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Activity entity.
				 *
				 * @actions
				 * @param {Number} id - Activity Id
				 *
				 * @returns {Object} - Activity entity
				 */
				 find: {
					description: "Find Activity",
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
						return Promise.resolve(await new ActivityEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
