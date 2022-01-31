"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import IData from "../@types/data";
import IMessage from "../@types/message";
import CityEntityManager from "./../orm/entitymanagers/city.entity.manager";
import CityModel from "./../orm/models/city.model";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import CityEntity from "./../orm/entities/city.entity";

/**
 * @name - City Service
 * @description - Manage Cities
 */
export default class CityService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "city",
            version: 1,
			aliases:"city",
			adapter:new TypeOrmDbAdapter(base("city")),
			mixins: [DbService],
			model: CityEntity,
			async afterConnected() {
				console.log("CityService Database connected!!!!");
				// Seed the DB with ˙this.create`
				await new CityEntityManager(this.adapter).init();
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"country_id",
					"area_id",
					"name",
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
				 * Create City.
				 *
				 * @actions
				 * @param {Number} country_id - Country Id ref
				 * @param {Number} area_id - Area Id ref
				 * @param {String} name - Name of city
				 *
				 * @returns {Object} - City entity
				 */
				create: {
					description: "Create city",
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
						area_id: {
							type: "number",
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
						area_id: string, 
						country_id: string
						}>): Promise<any> {
							return Promise.resolve(await new CityEntityManager(this.adapter).create({
								area_id:ctx.params.area_id,
								country_id:ctx.params.country_id,
								name:ctx.params.name
							}));
					},
				},
				/**
				 * Update City.
				 *
				 * @actions
				 * @param {Number} id - City Id
				 * @param {Number} country_id - Country Id ref
				 * @param {Number} area_id - Area Id ref
				 * @param {String} name - Name of city
				 *
				 * @returns {Object} - City entity
				 */
				update: {
					description: "Update city",
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
						area_id: {
							type: "number",
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
						area_id: string, 
						country_id: string
					}>): Promise<any> {
						return Promise.resolve(await new CityEntityManager(this.adapter).update({
							id:ctx.params.id,
							area_id:ctx.params.area_id??null,
							country_id:ctx.params.country_id??null,
							name:ctx.params.name??null
						}));
					},
				},
				/**
				 * Remove City.
				 *
				 * @actions
				 * @param {Number} id - City Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete city",
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
						return Promise.resolve(await new CityEntityManager(this.adapter).delete(ctx.params.id));
					},
				},
				
				/**
				 * List City entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 * @param {Number} country_id - Country Id ref (optional)
				 * @param {Number} area_id - Area Id ref (optional)
				 *
				 * @returns {Object[]} - City entities
				 */
				list: {
					description: "List of cities",
					rest: {
						method: "GET",
						path: "/list",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string",
                        area_id: { type: "number", integer: true, optional: true },
                        country_id: { type: "number", integer: true, optional: true },
					},
					async handler(ctx: Context<{
						filter: string, 
						offset: number, 
						page: number,
						country_id?: number,
						area_id?: number,
					}>): Promise<any> {
						return Promise.resolve(await new CityEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.params.area_id??null, ctx.params.country_id??null));
					},
				},
				
				/**
				 * List and Count City entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 * @param {Number} country_id - Country Id ref (optional)
				 * @param {Number} area_id - Area Id ref (optional)
				 *
				 * @returns {[Object[], Number]} - City entities
				 */
				listcount: {
					description: "List and Count cities",
					rest: {
						method: "GET",
						path: "/listcount",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string",
                        area_id: { type: "number", integer: true, optional: true },
                        country_id: { type: "number", integer: true, optional: true },
					},
					async handler(ctx: Context<{
						filter: string,
						offset: number, 
						page: number,
						country_id?: number,
						area_id?: number,
					}>): Promise<any> {
						return Promise.resolve(await new CityEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.params.area_id??null, ctx.params.country_id??null));
					},
				},
				
				/**
				 * Count city entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} country_id - Country Id ref (optional)
				 * @param {Number} area_id - Area Id ref (optional)
				 *
				 * @returns {Number} - Number of cities
				 */
				count: {
					description: "Find city",
					rest: {
						method: "GET",
						path: "/count",
					},
					params: {
						filter: "string",
                        area_id: { type: "number", integer: true, optional: true },
                        country_id: { type: "number", integer: true, optional: true },
					},
					async handler(ctx: Context<{
						filter: string,
						country_id?: number,
						area_id?: number,
					}>): Promise<any> {
						return Promise.resolve(await new CityEntityManager(this.adapter).count(ctx.params.filter, ctx.params.area_id??null, ctx.params.country_id??null));
					},
				},
				
				/**
				 * Find city entity.
				 *
				 * @actions
				 * @param {Number} id - City Id
				 *
				 * @returns {Object} - City entity
				 */
				 find: {
					description: "Find city",
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
						return Promise.resolve(await new CityEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
