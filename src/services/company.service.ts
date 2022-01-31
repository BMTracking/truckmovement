"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context, Errors} from "moleculer";
import CompanyEntityManager from "./../orm/entitymanagers/company.entity.manager";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import CompanyEntity from "./../orm/entities/company.entity";

/**
 * @name - Company Service
 * @description - Manage Companies
 */
export default class CompanyService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "company",
            version: 1,
			aliases:"company",
			adapter:new TypeOrmDbAdapter(base("company")),
			mixins: [DbService],
			model: CompanyEntity,
			dependencies: [
				//"token",
			],
			afterConnected() {
				console.log("CompanyService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"user_id",
					"bank_id",
					"activity_id",
					"country_id",
					"area_id",
					"city_id",
					"niu",
					"name",
					"phone1",
					"phone2",
					"email",
					"pobox",
					"website",
					"address1",
					"address2",
					"longitude",
					"latitude",
					"bank_code",
					"bank_key",
					"bank_doc",
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
				 * Create Company.
				 *
				 * @actions
				 * @param {String} description - Description of Company
				 * @param {String} name - Name of Company
				 *
				 * @returns {Object} - Company entity
				 */
                 create: {
					description: "Create Company",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						"bank_id":{
							type: "number",
							optional: false,
							require:true
						},
						"activity_id":{
							type: "number",
							optional: false,
							require:true
						},
						"country_id":{
							type: "number",
							optional: false,
							require:true
						},
						"area_id":{
							type: "number",
							optional: false,
							require:true
						},
						"city_id":{
							type: "number",
							optional: false,
							require:true
						},
						"niu":{
							type: "string",
							optional: true,
							require:false
						},
						"name": {
							type: "string",
							optional: false,
							require:true
						},
						"phone1": {
							type: "string",
							optional: false,
							require:true
						},
						"phone2":{
							type: "string",
							optional: true,
							require:false
						},
						"email": {
							type: "string",
							optional: false,
							require:true
						},
						"pobox":{
							type: "string",
							optional: true,
							require:false
						},
						"website":{
							type: "string",
							optional: true,
							require:false
						},
						"address1": {
							type: "string",
							optional: false,
							require:true
						},
						"address2":{
							type: "string",
							optional: true,
							require:false
						},
						"longitude":"number",
						"latitude":"number",
						"bank_code":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_key":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_doc":{
							type: "string",
							optional: true,
							require:false
						}
					},
					async handler(ctx: any/*Context<{
						bank_id?:number,
						activity_id:number,
						country_id:number,
						area_id:number,
						city_id:number,
						niu?:string,
						name:string,
						phone1:string,
						phone2?:string,
						email:string,
						pobox?:string,
						website?:string,
						address1:string,
						address2?:string,
						longitude?:number,
						latitude?:number,
						bank_code?:string,
						bank_key?:string,
						bank_doc?:string
						}, {meta:{userId:number}}>*/): Promise<any> {
							const db = await new CompanyEntityManager(this.adapter);
							const niu = await db.findByNiu(ctx.params.niu);
							if (niu)
								throw new Errors.MoleculerClientError(
									"NIU_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
							const email = await db.findByEmail(ctx.params.email);
							if (email)
								throw new Errors.MoleculerClientError(
									"Email_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
							//
							return Promise.resolve(await new CompanyEntityManager(this.adapter).create({
								user_id:ctx.meta.userID,
								bank_id:ctx.params.bank_id??null,
								activity_id:ctx.params.activity_id,
								country_id:ctx.params.country_id,
								area_id:ctx.params.area_id,
								city_id:ctx.params.city_id,
								type:ctx.meta.user.role_id,
								niu:ctx.params.niu,
								name:ctx.params.name,
								phone1:ctx.params.phone1,
								phone2:ctx.params.phone2??null,
								email:ctx.params.email,
								pobox:ctx.params.pobox??null,
								website:ctx.params.website??null,
								address1:ctx.params.address1,
								address2:ctx.params.address2??null,
								longitude:ctx.params.longitude??null,
								latitude:ctx.params.latitude??null,
								bank_code:ctx.params.bank_code??null,
								bank_key:ctx.params.bank_key??null,
								bank_doc:ctx.params.bank_doc??null,
							}));
					},
				},
				/**
				 * Change Company by user.
				 *
				 * @actions
				 * @param {String} description - Description of Company
				 * @param {String} name - Name of Company
				 *
				 * @returns {Object} - Company entity
				 */
				updateme: {
					description: "Update Company",
					rest: {
						method: "PUT",
						path: "/:id/edit",
					},
					params: {
						"id":{
							type: "number",
							optional: false,
							require:true
						},
						"bank_id":{
							type: "number",
							optional: true,
							require:false
						},
						"activity_id":{
							type: "number",
							optional: true,
							require:false
						},
						"country_id":{
							type: "number",
							optional: true,
							require:false
						},
						"area_id":{
							type: "number",
							optional: true,
							require:false
						},
						"city_id":{
							type: "number",
							optional: true,
							require:false
						},
						"niu":{
							type: "string",
							optional: true,
							require:false
						},
						"name": {
							type: "string",
							optional: true,
							require:false
						},
						"phone1": {
							type: "string",
							optional: true,
							require:false
						},
						"phone2":{
							type: "string",
							optional: true,
							require:false
						},
						"email": {
							type: "string",
							optional: true,
							require:false
						},
						"pobox":{
							type: "string",
							optional: true,
							require:false
						},
						"website":{
							type: "string",
							optional: true,
							require:false
						},
						"address1": {
							type: "string",
							optional: true,
							require:false
						},
						"address2":{
							type: "string",
							optional: true,
							require:false
						},
						"longitude":{
							type: "number",
							optional: true,
							require:false
						},
						"latitude":{
							type: "number",
							optional: true,
							require:false
						},
						"bank_code":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_key":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_doc":{
							type: "string",
							optional: true,
							require:false
						}
					},
					async handler(ctx: any/* Context<{
						id?:number,
						bank_id?:number,
						activity_id:number,
						country_id:number,
						area_id:number,
						city_id:number,
						niu?:string,
						name:string,
						phone1:string,
						phone2?:string,
						email:string,
						pobox?:string,
						website?:string,
						address1:string,
						address2?:string,
						longitude?:number,
						latitude?:number,
						bank_code?:string,
						bank_key?:string,
						bank_doc?:string,
					}>*/): Promise<any> {
						const db = await new CompanyEntityManager(this.adapter);
						const found = await db.findByUserId(ctx.meta.userID);
						if (!found)
							throw new Errors.MoleculerClientError(
								"Company_details_not_found",
								400,
								"COMPANY_NOT_EXISTS"
							);
						if(ctx.params.niu && ctx.params.niu != null){
							const niu = await db.findByNiu(ctx.params.niu);
							if (niu && (await niu).id != (await found).id)
								throw new Errors.MoleculerClientError(
									"NIU_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
						}
						if(ctx.params.email && ctx.params.email != null){
							const email = await db.findByEmail(ctx.params.email);
							if (email && (await email).id != (await found).id)
								throw new Errors.MoleculerClientError(
									"Email_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
						}
						//
						return Promise.resolve(await db.update({
							id:ctx.params.id,
							bank_id:ctx.params.bank_id??null,
							activity_id:ctx.params.activity_id??null,
							country_id:ctx.params.country_id??null,
							area_id:ctx.params.area_id??null,
							city_id:ctx.params.city_id??null,
							niu:ctx.params.niu??null,
							name:ctx.params.name??null,
							phone1:ctx.params.phone1??null,
							phone2:ctx.params.phone2??null,
							email:ctx.params.email??null,
							pobox:ctx.params.pobox??null,
							website:ctx.params.website??null,
							address1:ctx.params.address1??null,
							address2:ctx.params.address2??null,
							longitude:ctx.params.longitude??null,
							latitude:ctx.params.latitude??null,
							bank_code:ctx.params.bank_code??null,
							bank_key:ctx.params.bank_key??null,
							bank_doc:ctx.params.bank_doc??null,
						}, found));
					},
				},
				/**
				 * Update Company.
				 *
				 * @actions
				 * @param {Number} id - Company Id
				 * @param {String} description - Description of Company
				 * @param {String} name - Name of Company
				 *
				 * @returns {Object} - Company entity
				 */
				update: {
					description: "Update Company",
					rest: {
						method: "PUT",
						path: "/:id/edit",
					},
					params: {
						"id":{
							type: "number",
							optional: false,
							require:true
						},
						"bank_id":{
							type: "number",
							optional: true,
							require:false
						},
						"activity_id":{
							type: "number",
							optional: true,
							require:false
						},
						"country_id":{
							type: "number",
							optional: true,
							require:false
						},
						"area_id":{
							type: "number",
							optional: true,
							require:false
						},
						"city_id":{
							type: "number",
							optional: true,
							require:false
						},
						"niu":{
							type: "string",
							optional: true,
							require:false
						},
						"name": {
							type: "string",
							optional: true,
							require:false
						},
						"phone1": {
							type: "string",
							optional: true,
							require:false
						},
						"phone2":{
							type: "string",
							optional: true,
							require:false
						},
						"email": {
							type: "string",
							optional: true,
							require:false
						},
						"pobox":{
							type: "string",
							optional: true,
							require:false
						},
						"website":{
							type: "string",
							optional: true,
							require:false
						},
						"address1": {
							type: "string",
							optional: true,
							require:false
						},
						"address2":{
							type: "string",
							optional: true,
							require:false
						},
						"longitude":{
							type: "number",
							optional: true,
							require:false
						},
						"latitude":{
							type: "number",
							optional: true,
							require:false
						},
						"bank_code":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_key":{
							type: "string",
							optional: true,
							require:false
						},
						"bank_doc":{
							type: "string",
							optional: true,
							require:false
						}
					},
					async handler(ctx: Context<{
						id?:number,
						bank_id?:number,
						activity_id:number,
						country_id:number,
						area_id:number,
						city_id:number,
						niu?:string,
						name:string,
						phone1:string,
						phone2?:string,
						email:string,
						pobox?:string,
						website?:string,
						address1:string,
						address2?:string,
						longitude?:number,
						latitude?:number,
						bank_code?:string,
						bank_key?:string,
						bank_doc?:string,
					}>): Promise<any> {
						const db = await new CompanyEntityManager(this.adapter);
						const found = await db.find(ctx.params.id);
						
						if(ctx.params.niu && ctx.params.niu != null){
							const niu = await db.findByNiu(ctx.params.niu);
							if (niu && (await niu).id != (await found).id)
								throw new Errors.MoleculerClientError(
									"NIU_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
						}
						if(ctx.params.email && ctx.params.email != null){
							const email = await db.findByEmail(ctx.params.email);
							if (email && (await email).id != (await found).id)
								throw new Errors.MoleculerClientError(
									"Email_has_already_been_registered",
									400,
									"EMAIL_EXISTS"
								);
						}
						//
						return Promise.resolve(await db.update({
							id:ctx.params.id,
							bank_id:ctx.params.bank_id??null,
							activity_id:ctx.params.activity_id??null,
							country_id:ctx.params.country_id??null,
							area_id:ctx.params.area_id??null,
							city_id:ctx.params.city_id??null,
							niu:ctx.params.niu??null,
							name:ctx.params.name??null,
							phone1:ctx.params.phone1??null,
							phone2:ctx.params.phone2??null,
							email:ctx.params.email??null,
							pobox:ctx.params.pobox??null,
							website:ctx.params.website??null,
							address1:ctx.params.address1??null,
							address2:ctx.params.address2??null,
							longitude:ctx.params.longitude??null,
							latitude:ctx.params.latitude??null,
							bank_code:ctx.params.bank_code??null,
							bank_key:ctx.params.bank_key??null,
							bank_doc:ctx.params.bank_doc??null,
						}, found));
					},
				},
				/**
				 * Remove Company.
				 *
				 * @actions
				 * @param {Number} id - Company Id
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete Company",
					rest: {
						method: "DELETE",
						path: "/:id/delete",
					},
					params: {
						"id":{
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						id: string|number
					}>): Promise<any> {
						const Company = await new CompanyEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("Company.deleted", Company, ["Company", "mail"]);
						return Promise.resolve(null);
					},
				},
				
				/**
				 * List Company entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - Company entities
				 */
				list: {
					description: "List of Companies",
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
						return Promise.resolve(await new CompanyEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and Count Company entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} - Company entities
				 */
				listcount: {
					description: "List and Count Companies",
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
						return Promise.resolve(await new CompanyEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count Company entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of Companies
				 */
				count: {
					description: "Find Company",
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
						return Promise.resolve(await new CompanyEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find Company entity.
				 *
				 * @actions
				 * @param {Number} id - Company Id
				 *
				 * @returns {Object} - Company entity
				 */
				 find: {
					description: "Find Company",
					rest: {
						method: "GET",
						path: "/:id/show",
					},
					params: {
						"id":{
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						id: string|number
					}>): Promise<any> {
						return Promise.resolve(await new CompanyEntityManager(this.adapter).find(ctx.params.id));
					},
				},
			}
		});
	}
}
