"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import RequestEntityManager from "./../orm/entitymanagers/request.entity.manager";
import DbService from "moleculer-db";
import { base } from "../config/db";
import RequestEntity from "./../orm/entities/request.entity";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { REQUEST_STATUS, REQUEST_STATUS_NEW } from "../config/const";

/**
 * @name - Request Service
 * @description - Manage Requests
 */
export default class RequestService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "request",
            version: 1,
			aliases:"request",
			adapter:new TypeOrmDbAdapter(base("request")),
			mixins: [DbService],
			model: RequestEntity,
			dependencies: [
				//"token",
			],
			afterConnected() {
				console.log("RequestService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					'transporter_id',
					'customer_id',
					'drop_date', 
					'delivery_date',
					'marchandise',
					'transit',
					'from_country_id',
					'from_area_id',
					'from_city_id',
					'from_address',
					'from_longitude',
					'from_lattitude',
					'to_country_id',
					'to_area_id',
					'to_city_id',
					'to_address',
					'to_longitude',
					'to_lattitude',
					'status',
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
				 * Create Request.
				 *
				 * @actions
				 * @param {String} drop_date - Drop date
				 * @param {String} delivery_date - Delivery Date
				 * @param {String} marchandise - Marchandie of Request
				 * @param {String} transit - transit of Request
				 * @param {String} from_country_id - Drop country Ref
				 * @param {String} from_area_id - Drop rea Ref
				 * @param {String} from_city_id - Drop city Ref
				 * @param {String} from_address - Drop address
				 * @param {Number} from_longitude - Drop longitude
				 * @param {Number} from_lattitude - Drop latitude
				 * @param {String} to_country_id - Delivery country Ref
				 * @param {String} to_area_id - Delivery rea Ref
				 * @param {String} to_city_id - Delivery city Ref
				 * @param {String} to_address - Delivery address
				 * @param {Number} to_longitude - Delivery longitude
				 * @param {Number} to_lattitude - Delivery latitude
				 *
				 * @returns {Object} - Request entity
				 */
                 create: {
					description: "Create Request",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						drop_date: {
							type: "string",
							optional: false,
							require:true
						},
						delivery_date: {
							type: "string",
							optional: false,
							require:true
						},
						marchandise: {
							type: "string",
							optional: false,
							require:true
						},
						transit: {
							type: "boolean",
							optional: false,
							require:true
						},
						from_country_id: {
							type: "string",
							optional: false,
							require:true
						},
						from_area_id: {
							type: "string",
							optional: false,
							require:true
						},
						from_city_id: {
							type: "string",
							optional: false,
							require:true
						},
						from_address: {
							type: "string",
							optional: false,
							require:true
						},
						from_longitude: {
							type: "number",
							optional: true,
							require:false
						},
						from_lattitude: {
							type: "number",
							optional: true,
							require:false
						},
						to_country_id: {
							type: "string",
							optional: false,
							require:true
						},
						to_area_id: {
							type: "string",
							optional: false,
							require:true
						},
						to_city_id: {
							type: "string",
							optional: false,
							require:true
						},
						to_address: {
							type: "string",
							optional: false,
							require:true
						},
						to_longitude: {
							type: "number",
							optional: true,
							require:false
						},
						to_lattitude: {
							type: "number",
							optional: true,
							require:false
						}
					},
					async handler(ctx: any /*Context<{
						drop_date:Date,   
						delivery_date:Date,
						marchandise:string,
						transit:boolean,
						from_country_id:any,
						from_area_id:any,
						from_city_id:any,
						from_address:string,
						from_longitude?:number,
						from_lattitude?:number,
						to_country_id:any,
						to_area_id:any,
						to_city_id:any,
						to_address:string,
						to_longitude?:number,
						to_lattitude?:number,
						status:number,
						}>*/): Promise<any> {
							return Promise.resolve(await new RequestEntityManager(this.adapter).update({
								customer_id:ctx.meta.userId,
								drop_date:ctx.params.drop_date,
								delivery_date:ctx.params.delivery_date,
								marchandise:ctx.params.marchandise,
								transit:ctx.params.transit,
								from_country_id:ctx.params.from_country_id,
								from_area_id:ctx.params.from_area_id,
								from_city_id:ctx.params.from_city_id,
								from_address:ctx.params.from_address,
								from_longitude:ctx.params.from_longitude,
								from_lattitude:ctx.params.from_lattitude,
								to_country_id:ctx.params.to_country_id,
								to_area_id:ctx.params.to_area_id,
								to_city_id:ctx.params.to_city_id,
								to_address:ctx.params.to_address,
								to_longitude:ctx.params.to_longitude,
								to_lattitude:ctx.params.to_lattitude,
								status:ctx.params.status,
							}));
					},
				},
				/**
				 * Update Request.
				 *
				 * @actions
				 * @param {String} drop_date - Drop date
				 * @param {String} delivery_date - Delivery Date
				 * @param {String} marchandise - Marchandie of Request
				 * @param {String} transit - transit of Request
				 * @param {String} from_country_id - Drop country Ref
				 * @param {String} from_area_id - Drop rea Ref
				 * @param {String} from_city_id - Drop city Ref
				 * @param {String} from_address - Drop address
				 * @param {Number} from_longitude - Drop longitude
				 * @param {Number} from_lattitude - Drop latitude
				 * @param {String} to_country_id - Delivery country Ref
				 * @param {String} to_area_id - Delivery rea Ref
				 * @param {String} to_city_id - Delivery city Ref
				 * @param {String} to_address - Delivery address
				 * @param {Number} to_longitude - Delivery longitude
				 * @param {Number} to_lattitude - Delivery latitude
				 *
				 * @returns {Object} - Request entity
				 */
				 myupdate: {
					description: "Update Logged User Request Request's details",
					rest: {
						method: "PUT",
						path: "/:id/myedit",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require: true
						},						
						drop_date: {
							type: "string",
							optional: true,
							require: false
						},
						delivery_date: {
							type: "string",
							optional: true,
							require: false
						},
						marchandise: {
							type: "string",
							optional: true,
							require: false
						},
						transit: {
							type: "boolean",
							optional: true,
							require: false
						},
						from_country_id: {
							type: "string",
							optional: true,
							require: false
						},
						from_area_id: {
							type: "string",
							optional: true,
							require: false
						},
						from_city_id: {
							type: "string",
							optional: true,
							require: false
						},
						from_address: {
							type: "string",
							optional: true,
							require: false
						},
						from_longitude: {
							type: "number",
							optional: true,
							require:false
						},
						from_lattitude: {
							type: "number",
							optional: true,
							require:false
						},
						to_country_id: {
							type: "string",
							optional: true,
							require: false
						},
						to_area_id: {
							type: "string",
							optional: true,
							require: false
						},
						to_city_id: {
							type: "string",
							optional: true,
							require: false
						},
						to_address: {
							type: "string",
							optional: true,
							require: false
						},
						to_longitude: {
							type: "number",
							optional: true,
							require:false
						},
						to_lattitude: {
							type: "number",
							optional: true,
							require:false
						},
                        status: {
                            type: "enum",
                            values: REQUEST_STATUS,
							optional: true,
							require:false
                        },
					},
					async handler(ctx: any /*Context<{
						id:string,   
						drop_date:Date,   
						delivery_date:Date,
						marchandise:string,
						transit:boolean,
						from_country_id:any,
						from_area_id:any,
						from_city_id:any,
						from_address:string,
						from_longitude?:number,
						from_lattitude?:number,
						to_country_id:any,
						to_area_id:any,
						to_city_id:any,
						to_address:string,
						to_longitude?:number,
						to_lattitude?:number,
						status:number,
						}>*/): Promise<any> {
						return Promise.resolve(await new RequestEntityManager(this.adapter).update({
								id:ctx.params.id,
								transporter_id:ctx.params.transporter_id??null,
								drop_date:ctx.params.drop_date??null,
								delivery_date:ctx.params.delivery_date??null,
								marchandise:ctx.params.marchandise??null,
								transit:ctx.params.transit??null,
								from_country_id:ctx.params.from_country_id??null,
								from_area_id:ctx.params.from_area_id??null,
								from_city_id:ctx.params.from_city_id??null,
								from_address:ctx.params.from_address??null,
								from_longitude:ctx.params.from_longitude??null,
								from_lattitude:ctx.params.from_lattitude??null,
								to_country_id:ctx.params.to_country_id??null,
								to_area_id:ctx.params.to_area_id??null,
								to_city_id:ctx.params.to_city_id??null,
								to_address:ctx.params.to_address??null,
								to_longitude:ctx.params.to_longitude??null,
								to_lattitude:ctx.params.to_lattitude??null,
								status:ctx.params.status??null
						}, ctx.meta.userId));
					},
				},
			},
			/**
				 * Remove Request.
				 *
				 * @actions
				 * @param {Number} id - Request Id
				 *
				 * @returns {Null}
				 */
			 myremove: {
				description: "Delete Logged User Request",
				rest: {
					method: "DELETE",
					path: "/:id/mydelete",
				},
				params: {
					id: {
						type: "number",
						optional: false,
						require:true
					},
				},
				async handler(ctx: any/*Context<{
					id: string|number
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).delete(ctx.params.id, ctx.meta.userId));
				},
			},
			
			/**
			 * List Request entities (Data Pagination).
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 * @param {Number} offset - Number or records by page
			 * @param {Number} page - Current page number
			 *
			 * @returns {Object[]} - Request entities
			 */
			mylist: {
				description: "List all Requests",
				rest: {
					method: "GET",
					path: "/mylist",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					offset: {
						type: "number",
						optional: false,
						require:true
					},
					page: {
						type: "number",
						optional: false,
						require:true
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any /*Context<{
					filter: string, 
					offset: number, 
					page: number,
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.meta.userId, ctx.params.transporter_id??null));
				},
			},
			
			/**
			 * List and CountRequest entities (Data Pagination).
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 * @param {Number} offset - Number or records by page
			 * @param {Number} page - Current page number
			 *
			 * @returns {[Object[], Number]} - Request entitie, total records
			 */
			mylistcount: {
				description: "List and count all Requests",
				rest: {
					method: "GET",
					path: "/mylistcount",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					offset: {
						type: "number",
						optional: false,
						require:true
					},
					page: {
						type: "number",
						optional: false,
						require:true
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any/*Context<{
					filter: string,
					offset: number, 
					page: number,
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.meta.userId, ctx.params.transporter_id??null));
				},
			},
			
			/**
			 * Count Request entities .
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 *
			 * @returns {Number} - Number of Requests
			 */
			mycount: {
				description: "Count all Requests",
				rest: {
					method: "GET",
					path: "/mycount",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any/*Context<{
					filter: string
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).count(ctx.params.filter, ctx.meta.userId));
				},
			},
			
			/**
			 * Find Request entity.
			 *
			 * @actions
			 * @param {Number} id - Request Id
			 *
			 * @returns {Object} - Request entity
			 */
			 myfind: {
				description: "Find Request",
				rest: {
					method: "GET",
					path: "/:id/myshow",
				},
				params: {
					id: {
						type: "number",
						optional: false,
						require:true
					},
				},
				async handler(ctx: any/*Context<{
					id: string|number
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).find(ctx.params.id, ctx.meta.userId));
				},
			},
			/**
				 * Update Request.
				 *
				 * @actions
				 * @param {String} drop_date - Drop date
				 * @param {String} delivery_date - Delivery Date
				 * @param {String} marchandise - Marchandie of Request
				 * @param {String} transit - transit of Request
				 * @param {String} from_country_id - Drop country Ref
				 * @param {String} from_area_id - Drop rea Ref
				 * @param {String} from_city_id - Drop city Ref
				 * @param {String} from_address - Drop address
				 * @param {Number} from_longitude - Drop longitude
				 * @param {Number} from_lattitude - Drop latitude
				 * @param {String} to_country_id - Delivery country Ref
				 * @param {String} to_area_id - Delivery rea Ref
				 * @param {String} to_city_id - Delivery city Ref
				 * @param {String} to_address - Delivery address
				 * @param {Number} to_longitude - Delivery longitude
				 * @param {Number} to_lattitude - Delivery latitude
				 *
				 * @returns {Object} - Request entity
				 */
			 update: {
				description: "Update Logged User Request Request's details",
				rest: {
					method: "PUT",
					path: "/:id/edit",
				},
				params: {
					id: {
						type: "number",
						optional: false,
						require: true
					},						
					drop_date: {
						type: "string",
						optional: true,
						require: false
					},
					delivery_date: {
						type: "string",
						optional: true,
						require: false
					},
					marchandise: {
						type: "string",
						optional: true,
						require: false
					},
					transit: {
						type: "boolean",
						optional: true,
						require: false
					},
					from_country_id: {
						type: "string",
						optional: true,
						require: false
					},
					from_area_id: {
						type: "string",
						optional: true,
						require: false
					},
					from_city_id: {
						type: "string",
						optional: true,
						require: false
					},
					from_address: {
						type: "string",
						optional: true,
						require: false
					},
					from_longitude: {
						type: "number",
						optional: true,
						require:false
					},
					from_lattitude: {
						type: "number",
						optional: true,
						require:false
					},
					to_country_id: {
						type: "string",
						optional: true,
						require: false
					},
					to_area_id: {
						type: "string",
						optional: true,
						require: false
					},
					to_city_id: {
						type: "string",
						optional: true,
						require: false
					},
					to_address: {
						type: "string",
						optional: true,
						require: false
					},
					to_longitude: {
						type: "number",
						optional: true,
						require:false
					},
					to_lattitude: {
						type: "number",
						optional: true,
						require:false
					},
					status: {
						type: "enum",
						values: REQUEST_STATUS,
						optional: true,
						require:false
					},
				},
				async handler(ctx: any /*Context<{
					id:string,   
					drop_date:Date,   
					delivery_date:Date,
					marchandise:string,
					transit:boolean,
					from_country_id:any,
					from_area_id:any,
					from_city_id:any,
					from_address:string,
					from_longitude?:number,
					from_lattitude?:number,
					to_country_id:any,
					to_area_id:any,
					to_city_id:any,
					to_address:string,
					to_longitude?:number,
					to_lattitude?:number,
					status:number,
					}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).update({
							id:ctx.params.id,
							transporter_id:ctx.params.transporter_id??null,
							drop_date:ctx.params.drop_date??null,
							delivery_date:ctx.params.delivery_date??null,
							marchandise:ctx.params.marchandise??null,
							transit:ctx.params.transit??null,
							from_country_id:ctx.params.from_country_id??null,
							from_area_id:ctx.params.from_area_id??null,
							from_city_id:ctx.params.from_city_id??null,
							from_address:ctx.params.from_address??null,
							from_longitude:ctx.params.from_longitude??null,
							from_lattitude:ctx.params.from_lattitude??null,
							to_country_id:ctx.params.to_country_id??null,
							to_area_id:ctx.params.to_area_id??null,
							to_city_id:ctx.params.to_city_id??null,
							to_address:ctx.params.to_address??null,
							to_longitude:ctx.params.to_longitude??null,
							to_lattitude:ctx.params.to_lattitude??null,
							status:ctx.params.status??null
					}));
				},
			},
			
			/**
			 * Remove Request.
			 *
			 * @actions
			 * @param {Number} id - Request Id
			 *
			 * @returns {Null}
			 */
			remove: {
				description: "Delete Logged User Request",
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
				async handler(ctx: any/*Context<{
					id: string|number
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).delete(ctx.params.id));
				},
			},
			
			/**
			 * List Request entities (Data Pagination).
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 * @param {Number} offset - Number or records by page
			 * @param {Number} page - Current page number
			 *
			 * @returns {Object[]} - Request entities
			 */
			list: {
				description: "List all Requests",
				rest: {
					method: "GET",
					path: "/list",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					offset: {
						type: "number",
						optional: false,
						require:true
					},
					page: {
						type: "number",
						optional: false,
						require:true
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any /*Context<{
					filter: string, 
					offset: number, 
					page: number,
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page, null, ctx.params.transporter_id??null));
				},
			},
			
			/**
			 * List and CountRequest entities (Data Pagination).
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 * @param {Number} offset - Number or records by page
			 * @param {Number} page - Current page number
			 *
			 * @returns {[Object[], Number]} - Request entitie, total records
			 */
			listcount: {
				description: "List and count all Requests",
				rest: {
					method: "GET",
					path: "/listcount",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					offset: {
						type: "number",
						optional: false,
						require:true
					},
					page: {
						type: "number",
						optional: false,
						require:true
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any/*Context<{
					filter: string,
					offset: number, 
					page: number,
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page, null, ctx.params.transporter_id??null));
				},
			},
			
			/**
			 * Count Request entities .
			 *
			 * @actions
			 * @param {String} filter - Filter value
			 *
			 * @returns {Number} - Number of Requests
			 */
			count: {
				description: "Count all Requests",
				rest: {
					method: "GET",
					path: "/count",
				},
				params: {
					filter: {
						type: "string",
						optional: true,
						require:false
					},
					transporter_id: {
						type: "number",
						optional: true,
						require:false
					},
				},
				async handler(ctx: any/*Context<{
					filter: string
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).count(ctx.params.filter));
				},
			},
			
			/**
			 * Find Request entity.
			 *
			 * @actions
			 * @param {Number} id - Request Id
			 *
			 * @returns {Object} - Request entity
			 */
			 find: {
				description: "Find Request",
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
				async handler(ctx: any/*Context<{
					id: string|number
				}>*/): Promise<any> {
					return Promise.resolve(await new RequestEntityManager(this.adapter).find(ctx.params.id));
				},
			},
		});
	}
}
