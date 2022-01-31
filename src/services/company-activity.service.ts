"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context} from "moleculer";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { base } from "../config/db";
import CompanyActivityEntityManager from "./../orm/entitymanagers/company-activity.entity.manager";
import CompanyActivityEntity from "./../orm/entities/company-activity.entity";

/**
 * @name - CompanyActivity Service
 * @description - Manage company composite activies 
 */
export default class CompanyActivityService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "company-activity",
            version: 1,
			aliases:"companyactivity",
			adapter:new TypeOrmDbAdapter(base("companyactivity")),
			mixins: [DbService],
			model: CompanyActivityEntity,
			rest: true,
			afterConnected() {
				console.log("CompanyActivityService Database connected!!!!");
				// Seed the DB with ˙this.create`
			},
			dependencies: [
				//"token",
			],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"company_id",
					"activity_id",,
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
			events: {
				"company.deleted": {
					// Register handler to the "mail" group instead of "payment" group.
					group: "company",
					async handler(company:any) {
						console.log("Company deleted!!!!!::  ",company);
						await new CompanyActivityEntityManager(this.adapter).deleteByCompany(company.id);
						return Promise.resolve({});
					}
				},
				"activity.deleted": {
					// Register handler to the "mail" group instead of "payment" group.
					group: "activity",
					async handler(activity:any) {
						console.log("Activity deleted!!!!!::  ",activity);
						await new CompanyActivityEntityManager(this.adapter).deleteByActivity(activity.id);
						return Promise.resolve({});
					}
				},
			},
			actions:{
				/**
				 * Add new Activity to Company.
				 *
				 * @actions
				 * @param {Number} company_id - Company Id ref
				 * @param {String} activity_id - Activity Id ref
				 *
				 * @returns {Object} - CompanyActivity entity
				 */
				create: {
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						company_id: {
							type: "number",
							optional: false,
							require:true
						},
						activity_id: {
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
							company_id: number, 
							activity_id: number
						}>): Promise<any> {
							const CompanyActivity = await new CompanyActivityEntityManager(this.adapter).create({
								company_id:ctx.params.company_id,
								activity_id:ctx.params.activity_id
							});
							return Promise.resolve(CompanyActivity);
					},
				},
				/**
				 * Remove Activity from Company.
				 *
				 * @actions
				 * @param {Number} company_id - Company Id ref
				 * @param {String} activity_id - Activity Id ref
				 *
				 * @returns {Null}
				 */
				revoque: {
					rest: {
						method: "DELETE",
						path: "/:id/revoque",
					},
					params: {
						company_id: {
							type: "number",
							optional: false,
							require:true
						},
						activity_id: {
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						company_id: string|number,
						activity_id: string|number,
					}>): Promise<any> {
						const rolepermission = await new CompanyActivityEntityManager(this.adapter).remove(ctx.params.company_id, ctx.params.activity_id);
						return Promise.resolve(null);
					},
				},
				/**
				 * Remove Activity from Company.
				 *
				 * @actions
				 * @param {Number} id - CompanyActivity Id ref
				 *
				 * @returns {Null}
				 */
				remove: {
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
						const CompanyActivity = await new CompanyActivityEntityManager(this.adapter).delete(ctx.params.id);
						return Promise.resolve(null);
					},
				},
			}
		});
	}

}
