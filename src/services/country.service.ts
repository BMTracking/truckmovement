"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import CountryEntityManager from "./../orm/entitymanagers/country.entity.manager";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import CountryEntity from "./../orm/entities/country.entity";

/**
 * @name - Country Service
 * @description - Manage Countries
 */
export default class CountryService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "country",
            version: 1,
			aliases:"country",
			adapter:new TypeOrmDbAdapter(base("country")),
			mixins: [DbService],
			model: CountryEntity,
			async afterConnected() {
				console.log("CountryService Database connected!!!!");
				// Seed the DB with ˙this.create`
				await new CountryEntityManager(this.adapter).init();
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"name",
					"code",,
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
				 * Create Country.
				 *
				 * @actions
				 * @param {String} code - Code of Country
				 * @param {String} name - Name of Country
				 *
				 * @returns {Object} - Country entity
				 */
                 create: {
					description: "Create Country",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						code:{
							type: "string",
							optional: false,
							require:true,
							min:2
						},
						name: {
							type: "string",
							optional: false,
							require:true,
							min:4
						},
					},
					async handler(ctx: Context<{
						name: string, 
						code: string,
						}>): Promise<any> {
							return Promise.resolve(await new CountryEntityManager(this.adapter).create({
								name:ctx.params.name,
								code:ctx.params.code,
							}));
					},
				},
				/**
				 * Update Country.
				 *
				 * @actions
				 * @param {Number} id - Country Id
				 * @param {String} code - Code of Country
				 * @param {String} name - Name of Country
				 *
				 * @returns {Object} - Country entity
				 */
				update: {
					description: "Update Country",
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
						code:{
							type: "string",
							optional: true,
							require:false,
							min:2
						},
						name: {
							type: "string",
							optional: true,
							require:false,
							min:4
						},
					},
					async handler(ctx: Context<{
						id: string, 
						name: string, 
						code: string,
					}>): Promise<any> {
						return Promise.resolve(await new CountryEntityManager(this.adapter).update({
							id:ctx.params.id,
							name:ctx.params.name??null,
							code:ctx.params.code??null,
						}));
					},
				},
				/**
				 * Remove Country.
				 *
				 * @actions
				 * @param {Number} id - Country Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Country",
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
						return Promise.resolve(await new CountryEntityManager(this.adapter).delete(ctx.params.id));
					},
				},
				
				/**
				 * List Country entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Country entities
				 */
				list: {
					description: "List of countries",
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
						return Promise.resolve(await new CountryEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and Count Country entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Country entities
				 */
				listcount: {
					description: "List and Count countries",
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
						return Promise.resolve(await new CountryEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Country entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of countries
				 */
				count: {
					description: "Find Country",
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
						return Promise.resolve(await new CountryEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Country entity.
				 *
				 * @actions
				 * @param {Number} id - Country Id
				 *
				 * @returns {Object} - Country entity
				 */
				 find: {
					description: "Find Country",
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
						return Promise.resolve(await new CountryEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
