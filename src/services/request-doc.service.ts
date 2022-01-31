"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import IData from "../@types/data";
import IMessage from "../@types/message";
import RequestDocEntityManager from "./../orm/entitymanagers/request-doc.entity.manager";
import RequestDocModel from "./../orm/models/request-doc.model";
import DbService from "moleculer-db";
import { base } from "../config/db";
import RequestDocEntity from "./../orm/entities/request-doc.entity";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";

/**
 * @name - RequestDoc Service
 * @description - Manage RequestDocs
 */
export default class RequestDocService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "requestdoc",
            version: 1,
			aliases:"requestdoc",
			adapter:new TypeOrmDbAdapter(base("requestdoc")),
			mixins: [DbService],
			model: RequestDocEntity,
			dependencies: [
				//"token",
			],
			afterConnected() {
				console.log("RequestDocService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"request_id",
					"doctype_id",
					"path",
					"name",
					"mime",
					"size",
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
				 * Create RequestDoc.
				 *
				 * @actions
				 * @param {Number} doctype_id - Doctype Id ref
				 * @param {Number} request_id - Request Id ref
				 * @param {String} file - File of RequestDoc
				 *
				 * @returns {Object} - RequestDoc entity
				 */
				create: {
					description: "Create RequestDoc",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						doctype_id: {
							type: "number",
							optional: false,
							require:true
						},
						request_id: {
							type: "number",
							optional: false,
							require:true
						},
						file: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: any/*Context<{
						file: string, 
						doctype_id: number, 
						request_id: number
						}>*/): Promise<any> {
							const file:RequestDocModel = await ctx.call("v1.file.commit", {
								file:ctx.params.file,
								owner:"requestdoc"
							});
							return Promise.resolve(await new RequestDocEntityManager(this.adapter).create({
								customer_id:ctx.meta.userId,
								doctype_id:ctx.params.doctype_id,
								request_id:ctx.params.request_id,
								name:file.name,
								mime:file.mime,
								size:file.size,
								path:file.path
							}));
					},
				},
				
				/**
				 * Remove RequestDoc.
				 *
				 * @actions
				 * @param {Number} id - RequestDoc Id
				 *
				 * @returns {Null}
				 */
				 remove: {
					description: "Delete RequestDoc",
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
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).delete(ctx.params.id, null));
					},
				},
				
				/**
				 * Remove RequestDoc.
				 *
				 * @actions
				 * @param {Number} id - RequestDoc Id
				 *
				 * @returns {Null}
				 */
				 myremove: {
					description: "Delete RequestDoc",
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
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).delete(ctx.params.id, ctx.meta.userId));
					},
				},
				
				/**
				 * List RequestDoc entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - RequestDoc entities
				 */
				mylist: {
					description: "List all RequestDocs",
					rest: {
						method: "GET",
						path: "/mylist",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: any /*Context<{
						filter: string, 
						offset: number, 
						page: number,
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.meta.userId, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * List and CountRequestDoc entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - RequestDoc entitie, total records
				 */
				mylistcount: {
					description: "List and count all RequestDocs",
					rest: {
						method: "GET",
						path: "/mylistcount",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: any/*Context<{
						filter: string,
						offset: number, 
						page: number,
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page, ctx.meta.userId, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * Count RequestDoc entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of RequestDocs
				 */
				mycount: {
					description: "Count all RequestDocs",
					rest: {
						method: "GET",
						path: "/mycount",
					},
					params: {
						filter: "string"
					},
					async handler(ctx: any/*Context<{
						filter: string
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).count(ctx.params.filter, ctx.meta.userId, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * Find RequestDoc entity.
				 *
				 * @actions
				 * @param {Number} id - RequestDoc Id
				 *
				 * @returns {Object} - RequestDoc entity
				 */
				 myfind: {
					description: "Find RequestDoc",
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
					async handler(ctx: any /*Context<{
						id: string|number
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).find(ctx.params.id, ctx.meta.userId));
					},
				},
				
				/**
				 * List RequestDoc entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - RequestDoc entities
				 */
				 list: {
					description: "List all RequestDocs",
					rest: {
						method: "GET",
						path: "/list",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: any /*Context<{
						filter: string, 
						offset: number, 
						page: number,
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page, null, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * List and CountRequestDoc entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - RequestDoc entitie, total records
				 */
				listcount: {
					description: "List and count all RequestDocs",
					rest: {
						method: "GET",
						path: "/listcount",
					},
					params: {
						filter: "string",
						offset: "string",
						page: "string"
					},
					async handler(ctx: any/*Context<{
						filter: string,
						offset: number, 
						page: number,
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page, null, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * Count RequestDoc entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of RequestDocs
				 */
				count: {
					description: "Count all RequestDocs",
					rest: {
						method: "GET",
						path: "/count",
					},
					params: {
						filter: "string"
					},
					async handler(ctx: any/*Context<{
						filter: string
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).count(ctx.params.filter, null, ctx.params.request_id??null, ctx.params.doctype_id??null));
					},
				},
				
				/**
				 * Find RequestDoc entity.
				 *
				 * @actions
				 * @param {Number} id - RequestDoc Id
				 *
				 * @returns {Object} - RequestDoc entity
				 */
				 find: {
					description: "Find RequestDoc",
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
					async handler(ctx: any /*Context<{
						id: string|number
					}>*/): Promise<any> {
						return Promise.resolve(await new RequestDocEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
