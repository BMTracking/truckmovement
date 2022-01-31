"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import IData from "../@types/data";
import IMessage from "../@types/message";
import TruckMovementEntityManager from "./../orm/entitymanagers/truck-movement.entity.manager";
import TruckMovementModel, { MOBILE_MOONEY, TYPES } from "./../orm/models/truck-movement.model";
import DbService from "moleculer-db";
import { base } from "../config/db";
import TruckMovementEntity from "./../orm/entities/truck-movement.entity";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import moment from 'moment';

/**
 * @name - TruckMovement Service
 * @description - Manage TruckMovements
 */
export default class TruckMovementService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "truckmovement",
            version: 1,
			aliases:"truckmovement",
			adapter:new TypeOrmDbAdapter(base("truckmovement")),
			mixins: [DbService],
			model: TruckMovementEntity,
			dependencies: [
				//"token",
			],
			async afterConnected() {
				console.log("TruckMovementService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"registration",
					"type",
					"mobilemoney_type",
					"mobilemoney_id",
					"amount",
					"weight",
					"date_in",
					"date_out",
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
				 * Create TruckMovement.
				 *
				 * @actions
				 * @param {String} registration - Vehicle Registration Number
				 * @param {Number} type - Type of Pouzzolane
				 * @param {String} mobilemoney_type - Mobile money paiment ref
				 * @param {String} mobilemoney_id - Mobile money paiment transaction code
				 * @param {Number} weight - Weight of Materials (Tonne)
				 * @param {Date} date_in - Date and Time on arrival
				 * @param {Date} date_out - Date and Time of leave
				 *
				 * @returns {Object} - TruckMovement entity
				 */
				create: {
					description: "Create TruckMovement",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						registration: {
							type: "string",
							optional: false,
							require:true
						},
						type: {
                            type: "string",
                            values: TYPES,
							optional: false,
							require:true
                        },
						mobilemoney_type: {
                            type: "string",
                            values: MOBILE_MOONEY,
							optional: false,
							require:true
                        },
						mobilemoney_id: {
							type: "string",
							optional: false,
							require:true
						},
						weight: {
							type: "string",
							optional: false,
							require:true
						},
						amount: {
							type: "string",
							optional: false,
							require:true
						},
						date_in: {
							type: "string",
							optional: false,
							pattern: /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g, 
							require:true
						},
						date_out: {
							type: "string",
							optional: false,
							pattern: /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g, 
							require:true
						},
						time_in: {
							type: "string",
							optional: false,
							pattern: /^[0-9]{2}[:]{1}[0-9]{2}$/g, 
							require:true
						},
						time_out: {
							type: "string",
							optional: false,
							pattern: /^[0-9]{2}[:]{1}[0-9]{2}$/g, 
							require:true
						},
					},
					async handler(ctx: Context<{
						registration: string, 
						type: number, 
						mobilemoney_type: number,
						mobilemoney_id: string, 
						amount: number, 
						weight: number, 
						date_in: Date, 
						date_out: Date, 
						time_in: Date, 
						time_out: Date
						}>): Promise<any> {
							console.log(ctx.params);
							return Promise.resolve(await new TruckMovementEntityManager(this.adapter).create({
								registration:ctx.params.registration,
								type:ctx.params.type,
								mobilemoney_type:ctx.params.mobilemoney_type,
								mobilemoney_id:ctx.params.mobilemoney_id,
								amount:ctx.params.amount,
								weight:ctx.params.weight,
								date_in: ctx.params.date_in,
								date_out: ctx.params.date_out,
								time_in: ctx.params.time_in,
								time_out: ctx.params.time_out,
							},"DD/MM/YYYY"));
					},
				},

				
				/**
				 * Update TruckMovement.
				 *
				 * @actions
				 * @param {Number} id - TruckMovement Id
				 * @param {Number} country_id - Country Id ref
				 * @param {String} name - Name of TruckMovement
				 * @param {String} code - Code of TruckMovement
				 *
				 * @returns {Object} - TruckMovement entity
				 */
				update: {
					description: "Update TruckMovement's details",
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
						registration: {
							type: "string",
							optional: true,
							require:false
						},
						type: {
                            type: "enum",
                            values: TYPES,
							optional: true,
							require:false
                        },
						mobilemoney_type: {
                            type: "enum",
                            values: MOBILE_MOONEY,
							optional: true,
							require:false
                        },
						mobilemoney_id: {
							type: "string",
							optional: true,
							require:false
						},
						weight: {
							type: "number",
							optional: true,
							require:false
						},
						amount: {
							type: "number",
							optional: true,
							require:false
						},
						date_in: {
							type: "string",
							optional: true,
							require:false
						},
						date_out: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
						id: number, 
						registration: string, 
						type: number, 
						mobilemoney_type: number,
						mobilemoney_id: string, 
						amount: number, 
						weight: number, 
						date_in: Date, 
						date_out: Date, 
						time_in: Date, 
						time_out: Date, 
					}>): Promise<any> {
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).update({
								id:ctx.params.id,
								registration:ctx.params.registration??null,
								type:ctx.params.type??null,
								mobilemoney_type:ctx.params.mobilemoney_type??null,
								mobilemoney_id:ctx.params.mobilemoney_id??null,
								amount:ctx.params.amount??null,
								weight:ctx.params.weight??null,
								date_in:ctx.params.date_in??null,
								date_out:ctx.params.date_out??null,
								time_in:ctx.params.time_in??null,
								time_out:ctx.params.time_out??null
						},"DD/MM/YYYY"));
					},
				},
				
				/**
				 * Remove TruckMovement.
				 *
				 * @actions
				 * @param {Number} id - TruckMovement Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete TruckMovement",
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
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).delete(ctx.params.id));
					},
				},
				
				/**
				 * List TruckMovement entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - TruckMovement entities
				 */
				list: {
					description: "List all TruckMovements",
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
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and CountTruckMovement entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - TruckMovement entitie, total records
				 */
				listcount: {
					description: "List and count all TruckMovements",
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
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count TruckMovement entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of TruckMovements
				 */
				count: {
					description: "Count all TruckMovements",
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
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find TruckMovement entity.
				 *
				 * @actions
				 * @param {Number} id - TruckMovement Id
				 *
				 * @returns {Object} - TruckMovement entity
				 */
				 find: {
					description: "Find TruckMovement",
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
						return Promise.resolve(await new TruckMovementEntityManager(this.adapter).find(ctx.params.id));
					},
				},
				
			}
		});
	}
}
