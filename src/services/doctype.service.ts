"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import IData from "../@types/data";
import IMessage from "../@types/message";
import DoctypeEntityManager from "./../orm/entitymanagers/doctype.entity.manager";
import DoctypeModel from "./../orm/models/doctype.model";
import DbService from "moleculer-db";
import { base } from "../config/db";
import DoctypeEntity from "./../orm/entities/doctype.entity";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";

/**
 * @name - Doctype Service
 * @description - Manage Doctypes
 */
export default class DoctypeService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "doctype",
            version: 1,
			aliases:"doctype",
			adapter:new TypeOrmDbAdapter(base("doctype")),
			mixins: [DbService],
			model: DoctypeEntity,
			dependencies: [
				//"token",
			],
			afterConnected() {
				console.log("DoctypeService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"country_id",
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
				 * Create Doctype.
				 *
				 * @actions
				 * @param {Number} country_id - Country Id ref
				 * @param {String} name - Name of Doctype
				 * @param {String} description - Description of Doctype
				 *
				 * @returns {Object} - Doctype entity
				 */
				create: {
					description: "Create Doctype",
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
						name:{
							type: "string",
							optional: false,
							require:true,
							min:6
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
						country_id: string
						}>): Promise<any> {
							return Promise.resolve(await new DoctypeEntityManager(this.adapter).create({
								country_id:ctx.params.country_id,
								name:ctx.params.name,
								description:ctx.params.description
							}));
					},
				},
				
				/**
				 * Create Doctype.
				 *
				 * @actions
				 * @param {Number} id - Doctype Id
				 * @param {Number} country_id - Country Id ref
				 * @param {String} name - Name of Doctype
				 * @param {String} description - Description of Doctype
				 *
				 * @returns {Object} - Doctype entity
				 */
				update: {
					description: "Update Doctype's details",
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
						name:{
							type: "string",
							optional: true,
							require:false,
							min:6
						},
						description: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
						id: string, 
						country_id: string,
						name: string, 
						description: string 
					}>): Promise<any> {
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).update({
							id:ctx.params.id,
							name:ctx.params.name??null,
							description:ctx.params.description??null,
							country_id:ctx.params.country_id??null
						}));
					},
				},
				
				/**
				 * Remove Doctype.
				 *
				 * @actions
				 * @param {Number} id - Doctype Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Doctype",
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
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).delete(ctx.params.id));
					},
				},
				
				/**
				 * List Doctype entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Doctype entities
				 */
				list: {
					description: "List all Doctypes",
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
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and CountDoctype entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Doctype entitie, total records
				 */
				listcount: {
					description: "List and count all Doctypes",
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
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Doctype entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of Doctypes
				 */
				count: {
					description: "Count all Doctypes",
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
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Doctype entity.
				 *
				 * @actions
				 * @param {Number} id - Doctype Id
				 *
				 * @returns {Object} - Doctype entity
				 */
				 find: {
					description: "Find Doctype",
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
						return Promise.resolve(await new DoctypeEntityManager(this.adapter).find(ctx.params.id));
					},
				},
				
			}
		});
	}
}
