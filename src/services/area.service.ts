"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import IData from "../@types/data";
import IMessage from "../@types/message";
import AreaEntityManager from "./../orm/entitymanagers/area.entity.manager";
import AreaModel from "./../orm/models/area.model";
import DbService from "moleculer-db";
import { base } from "../config/db";
import AreaEntity from "./../orm/entities/area.entity";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";

/**
 * @name - Area Service
 * @description - Manage Areas
 */
export default class AreaService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "area",
            version: 1,
			aliases:"area",
			adapter:new TypeOrmDbAdapter(base("area")),
			mixins: [DbService],
			model: AreaEntity,
			dependencies: [
				//"token",
			],
			async afterConnected() {
				console.log("AreaService Database connected!!!!");
				// Seed the DB with ˙this.create`
				await new AreaEntityManager(this.adapter).init();
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"country_id",
					"name",
					"code",
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
				 * Create Area.
				 *
				 * @actions
				 * @param {Number} country_id - Country Id ref
				 * @param {String} name - Name of area
				 * @param {String} code - Code of area
				 *
				 * @returns {Object} - Area entity
				 */
				create: {
					description: "Create area",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						country_id: {
							type: "number",
							optional: false,
							require:true
						},
						name: {
							type: "string",
							optional: false,
							require:true
						},
						code: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						name: string, 
						code: string, 
						country_id: string
						}>): Promise<any> {
							return Promise.resolve(await new AreaEntityManager(this.adapter).create({
								country_id:ctx.params.country_id,
								name:ctx.params.name,
								code:ctx.params.code
							}));
					},
				},
				
				/**
				 * Update Area.
				 *
				 * @actions
				 * @param {Number} id - Area Id
				 * @param {Number} country_id - Country Id ref
				 * @param {String} name - Name of area
				 * @param {String} code - Code of area
				 *
				 * @returns {Object} - Area entity
				 */
				update: {
					description: "Update area's details",
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
						country_id: {
							type: "number",
							optional: true,
							require:false
						},
						name: {
							type: "string",
							optional: true,
							require:false
						},
						code: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
						id: string, 
						country_id: string,
						name: string, 
						code: string 
					}>): Promise<any> {
						return Promise.resolve(await new AreaEntityManager(this.adapter).update({
							id:ctx.params.id,
							name:ctx.params.name??null,
							code:ctx.params.code??null,
							country_id:ctx.params.country_id??null
						}));
					},
				},
				
				/**
				 * Remove Area.
				 *
				 * @actions
				 * @param {Number} id - Area Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete area",
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
						return Promise.resolve(await new AreaEntityManager(this.adapter).delete(ctx.params.id));
					},
				},
				
				/**
				 * List Area entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Area entities
				 */
				list: {
					description: "List all areas",
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
						page: number,
					}>): Promise<any> {
						return Promise.resolve(await new AreaEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and CountArea entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Area entitie, total records
				 */
				listcount: {
					description: "List and count all areas",
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
						page: number,
					}>): Promise<any> {
						return Promise.resolve(await new AreaEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count area entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of areas
				 */
				count: {
					description: "Count all areas",
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
						return Promise.resolve(await new AreaEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find area entity.
				 *
				 * @actions
				 * @param {Number} id - Area Id
				 *
				 * @returns {Object} - Area entity
				 */
				 find: {
					description: "Find area",
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
						return Promise.resolve(await new AreaEntityManager(this.adapter).find(ctx.params.id));
					},
				},
				
			}
		});
	}
}
