"use strict";
import "reflect-metadata";
import {Service, ServiceBroker, Context, Errors} from "moleculer";
import UserEntityManager from "./../orm/entitymanagers/user.entity.manager";
import ApiGateway from "moleculer-web";
import UserEntity from "./../orm/entities/user.entity";
import UserModel from "./../orm/models/user.model";
import DbService from "moleculer-db";
import { TypeOrmDbAdapter } from "moleculer-db-adapter-typeorm";
import { validateToken, checkUser, generateAuthToken} from "../utils/jwt.utils";
import { base } from "../config/db";
import { REGISTER_CUSTOMER_GROUP, REGISTER_PROVIDER_GROUP, TOKEN_EXPIRATION, TOKEN_TYPE_API_KEY, TOKEN_TYPE_PASSWORD_RESET, TOKEN_TYPE_VERIFICATION } from "../config/const";
import TokenModel from "./../orm/models/token.model";

/**
 * @name - Account Service
 * @description - Manage account and authentification
 */
export default class AccountService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "account",
            version: 1,
			aliases: "account",
			adapter:new TypeOrmDbAdapter(base("account")),
			mixins: [DbService],
			model: UserEntity,
			rest: true,
			async afterConnected() {
				console.log("AuthService connected!!!!");
				// Seed the DB with ˙this.create`
				await new UserEntityManager(this.adapter).init();
			},
			settings: {
				rest: true,

				sendMail: "v1.mail.send",
				fields: ["id", "login", "name", "email", "phone", "address", "active", "createdAt", "updatedAt"],
				idField: 'id',
				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,
	
				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,
				// Available fields in the responses
				populates: {
					// Shorthand populate rule. Resolve the `voters` values with `users.get` action.
					"roles": "roles.get",
				}
			},
			hooks: {
				before: {
					/**
					 * Register a before hook for the `create` action.
					 * It sets a default value for the quantity field.
					 *
					 * @param {Context} ctx
					 */
					create: (ctx: Context<{ quantity: number }>) => {
						/**
						 *
						 * UserEntityManager
						 */
					},
				},
			},
			actions:{
				/**
				 * Get user by JWT token (for API GW authentication)
				 *
				 * @actions
				 * @param {String} token - JWT token
				 *
				 * @returns {Object} - Resolved user
				 */
				resolveToken: {
                    visibility: "public",
					description: "Get user by JWT token (for API JWT authentication)",
					cache: {
						keys: ["token"],
						ttl: 60 * 60 // 1 hour
					},
					params: {
						token: {
							type: "string",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						token: string
					}>) {
						//console.log("HELLLO", ctx.params.token);
						//console.log("resolveToken--token == " + ctx.params.token);
						// verify token hasn't expired yet
						const decodedToken:UserModel = await validateToken(ctx.params.token);
						//console.log("resolveToken--token == ", decodedToken);
						//console.log("decodedToken", decodedToken);
						if (!decodedToken.id)
							throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.ERR_INVALID_TOKEN, null);

						const user = await new UserEntityManager(this.adapter).find(decodedToken.id);
						checkUser(user);
						//console.log("resolveToken--decodedToken", user);

						return Promise.resolve(user);
					}
				},
				
				/**
				 * Get current user entity.
				 *
				 * @actions
				 *
				 * @returns {Object} - User entity
				 */
				 profile: {
					description: "Get the logged in user's profile",
					cache: {
						keys: ["#userID"]
					},
					rest: {
						method: "GET",
						path: "/profile",
					},
					async handler(ctx: any): Promise<any> {
						if (!ctx.meta.userID)
							throw new Errors.MoleculerClientError("Missing_user_ID", 400, "MISSING_USER_ID");
						const user = await new UserEntityManager(this.adapter).find(ctx.meta.userID);
						checkUser(user);
						if(!user)
							throw new Errors.MoleculerClientError(
								"Account_not_found.",
								400,
								"ACCOUNT_NOT_FOUND"
							);
						return Promise.resolve(user);
					}
				},
				
				/**
				 * Update current user entity.
				 *
				 * @actions
				 * @param {String} name - Name of user
				 * @param {String} email - Email of user
				 * @param {String} phone - Phone number of user
				 * @param {String} address - Address of user
				 *
				 * @returns {Object} - User entity
				 */
				updateprofile: {
					description: "Update logged user's profile",
					rest: {
						method: "PUT",
						path: "/updateprofile",
					},
					params: {
						name: {
							type: "string",
							optional: true,
							require:false,
							min:3
						},
						email: {
							type: "email",
							optional: true,
							require:false
						},
						phone: {
							type: "string",
							optional: true,
							require:false,
							min:6
						},
						address: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: any): Promise<any> {
						if (!ctx.meta.userID)
							throw new Errors.MoleculerClientError("Missing_user_ID", 400, "MISSING_USER_ID");
						const data = await new UserEntityManager(this.adapter).update({
							id:ctx.meta.userID,
							name:ctx.params.name??null,
							email:ctx.params.email??null,
							phone:ctx.params.phone??null,
							address:ctx.params.address??null
						});
						return Promise.resolve(data);
					},
				},
				
				/**
				 * Create user Session token.
				 *
				 * @actions
				 * @param {String} login - Username of user
				 * @param {String} password - Password of user
				 *
				 * @returns {String} - Token
				 */
				login: {
					//visibility: "public",
					description: "Authenticate user to system",
					rest: {
						method: "POST",
						path: "/login",
					},
					params: {
						login: {
							type: "string",
							optional: false,
							require:true
						},
						password: {
							type: "string",
							optional: false,
							require:true
						},	
					},
					async handler(ctx: Context<{
						login: string, 
						password: string
					}>): Promise<any> {
						const { login, password } = ctx.params;
						//await broker.call("user.list");
						const user:UserModel = await new UserEntityManager(this.adapter).login(login, password);
						if(user == null){
							throw new ApiGateway.Errors.BadRequestError("Email_or_password_is_invalid", null);
						}
						return Promise.resolve(await generateAuthToken(ctx, user));

					},
				},
				
				/**
				 * Create user entity.
				 *
				 * @actions
				 * @param {Number} role_id - User group
				 * @param {String} login - Username of user
				 * @param {String} password - Password of user
				 * @param {String} name - Name of user
				 * @param {String} email - Email of user
				 * @param {String} phone - Phone number of user
				 * @param {String} address - Address of user
				 *
				 * @returns {Object} - User entity
				 */
				create: {
					description: "Create new user",
					rest: {
						method: "POST",
						path: "/add",
					},
					params: {
						role_id: {
							type: "number",
							optional: false,
							require:true,
						},
						login: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
						password: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},					
						name: {
							type: "string",
							optional: false,
							require:true,
							min:3
						},
						email: {
							type: "email",
							optional: false,
							require:true,
						},	
						phone: {
							type: "string",
							optional: false,
							require:true,
							min:9
						},
						address: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
							role_id:string,
							login: string, 
							password: string, 
							name: string, 
							email: string, 
							phone: string, 
							address: string
						}>): Promise<any> {		
							const db = new UserEntityManager(this.adapter);					
						// Verify email
						const emailFound = await db.findByEmail(ctx.params.email);
						if (emailFound)
							throw new Errors.MoleculerClientError(
								"Email_has_already_been_registered",
								400,
								"EMAIL_EXISTS"
							);

						// Verify username
						const userFound  = await db.findByLogin(ctx.params.login);
						if (userFound)
							throw new Errors.MoleculerClientError(
								"Username_has_already_been_registered",
								400,
								"USERNAME_EXISTS"
							);
							const user = await db.create({
								role_id:ctx.params.role_id,
								login:ctx.params.login,
								password:ctx.params.password,
								name:ctx.params.name,
								email:ctx.params.email,
								phone:ctx.params.phone,
								address:ctx.params.address??null
							});
							// Send to all "mail" service instances
							this.broker.broadcast("user.created", user , "mail");
							return Promise.resolve(user);
					},
				},
				
				/**
				 * Update user entity.
				 *
				 * @actions
				 * @param {Number} id - User  
				 * @param {Number} role_id - User group
				 * @param {String} login - Username of user
				 * @param {String} name - Name of user
				 * @param {String} phone - Phone number of user
				 * @param {String} address - Address of user
				 *
				 * @returns {Object} - User entity
				 */
				update: {
					description: "Update user details",
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
						role_id: {
							type: "number",
							optional: true,
							require:false
						},
						name: {
							type: "string",
							optional: true,
							require:false,
							min:3
						},
						phone: {
							type: "string",
							optional: true,
							require:false,
							min:9
						},
						address: {
							type: "string",
							optional: true,
							require:false
						},
					},
					async handler(ctx: Context<{
						id:string,
						role_id:string,
						name: string,
						phone: string, 
						address: string
					}>): Promise<any> {
						return Promise.resolve(await new UserEntityManager(this.adapter).update({
							id:ctx.params.id,
							role_id:ctx.params.role_id,
							name:ctx.params.name??null,
							phone:ctx.params.phone??null,
							address:ctx.params.address??null
						}));
					},
				},
				
				/**
				 * Remove user entity.
				 *
				 * @actions
				 * @param {Number} id - User
				 *
				 * @returns {Null}
				 */
				remove: {
					description: "Delete user",
					rest: {
						method: "DELETE",
						path: "/:id/delete",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						id: string
					}>): Promise<any> {
						const user = await new UserEntityManager(this.adapter).delete(ctx.params.id);
						// Send to all "mail" service instances
						this.broker.broadcast("user.deleted", user , "mail");
						return Promise.resolve(null);
					},
				},
				
				/**
				 * List User entities (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {Object[]} - User entities
				 */
				 list: {
					description: "List of users",
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
						return Promise.resolve(await new UserEntityManager(this.adapter).search(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * List and count user entities  (Data Pagination).
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 * @param {Number} offset - Number or records by page
				 * @param {Number} page - Current page number
				 *
				 * @returns {[Object[], Number]} -  User entities, total records
				 */
				 listandcount: {
					description: "List and count of users",
					rest: {
						method: "GET",
						path: "/listandcount",
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
						return Promise.resolve(await new UserEntityManager(this.adapter).searchAndCount(ctx.params.filter, ctx.params.offset, ctx.params.page));
					},
				},
				
				/**
				 * Count user entities .
				 *
				 * @actions
				 * @param {String} filter - Filter value
				 *
				 * @returns {Number} - Number of users
				 */
				count: {
					description: "Get total of users",
					rest: {
						method: "GET",
						path: "/count",
					},
					params: {
						filter: "string"
					},
					async handler(ctx: Context<{
						filter: string, 
						offset: number, 
						page: number,
					}>): Promise<any> {
						return Promise.resolve(await new UserEntityManager(this.adapter).count(ctx.params.filter));
					},
				},
				
				/**
				 * Find user entity.
				 *
				 * @actions
				 * @param {Number} id - User Id
				 *
				 * @returns {Object} - User entity
				 */
				 find: {
					description: "Find user",
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
						id: string
					}>): Promise<any> {
						return Promise.resolve(await new UserEntityManager(this.adapter).find(ctx.params.id));
					},
				},
				
				/**
				 * Update logged user password.
				 *
				 * @actions
				 * @param {String} oldpassword - Current password
				 * @param {String} newpassword - New password
				 *
				 * @returns {Object} - User entity
				 */
				mypassword: {
					description: "Update logged user's password",
					rest: {
						method: "PUT",
						path: "/:id/mypassword",
					},
					params: {
						oldpassword: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
						newpassword: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
					},
					async handler(ctx: any): Promise<any> {
						if (!ctx.meta.userID)
							throw new Errors.MoleculerClientError("Missing_user_ID.", 400, "MISSING_USER_ID");
						return Promise.resolve(await new UserEntityManager(this.adapter).updateMypassword(ctx.meta.userID, ctx.params.oldpassword, ctx.params.newpassword));

					},
				},
				
				/**
				 * Update any user password.
				 *
				 * @actions
				 * @param {Number} id - User Id
				 * @param {String} password - New password
				 *
				 * @returns {Object} - User entity
				 */
				password: {
					description: "Update any user's password",
					rest: {
						method: "PUT",
						path: "/:id/password",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						},
						password: {
							type: "string",
							optional: false,
							require:true,
							min:6
						}
					},
					async handler(ctx: Context<{
						id: string,
						password: string
					}>): Promise<any> {
						return Promise.resolve(await new UserEntityManager(this.adapter).updatepassword(ctx.params.id, ctx.params.password));
					},
				},
				
				/**
				 * Register new user.
				 *
				 * @actions
				 * @param {Numner} role_id - Username of account (Valeurs possibles : `${REGISTER_CUSTOMER_GROUP}` et `${REGISTER_PROVIDER_GROUP}`)
				 * @param {String} login - Username of account
				 * @param {String} password - Password of account
				 * @param {String} name - Name of user
				 * @param {String} email - Email of user
				 *
				 * @returns {Object} - User entity
				 */
				register: {
					description: "Register a new user account",
					rest: {
						method: "POST",
						path: "/register",
					},
					params: {
                        role_id: {
                            type: "enum",
                            values: [
								REGISTER_CUSTOMER_GROUP,
								REGISTER_PROVIDER_GROUP
							],
							optional: false,
							require:true,
                        },
						login: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
						password: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
						name: {
							type: "string",
							optional: false,
							require:true,
							min:6
						},
						email: {
							type: "email",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						role_id: string,
						login: string,
						password: string,
						name: string,
						email: string,
					}>): Promise<any> {
						// Verify email
						const emailFound = await new UserEntityManager(this.adapter).findByEmail(ctx.params.email);
						if (emailFound)
							throw new Errors.MoleculerClientError(
								"Email_has_already_been_registered",
								400,
								"EMAIL_EXISTS"
							);

						// Verify username
						const userFound  = await new UserEntityManager(this.adapter).findByLogin(ctx.params.login);
						if (userFound)
							throw new Errors.MoleculerClientError(
								"Username_has_already_been_registered",
								400,
								"USERNAME_EXISTS"
							);

						//store user
						const user = await new UserEntityManager(this.adapter).create({
							role_id:ctx.params.role_id,
							login:ctx.params.login,
							password:ctx.params.password,
							name:ctx.params.name,
							email:ctx.params.email,
							verified:false,
							active:false
						});

						// Generate a reset token
						const token:any = await ctx.call("v1.token.generate", {
							type:TOKEN_TYPE_VERIFICATION,
							owner:JSON.stringify(user),
							expiry: TOKEN_EXPIRATION
						});
						
						// Send verification email
						this.sendMail(ctx, user, "activate", { token:token });
						// Send to all "mail" service instances
						this.broker.broadcast("user.registred", user , "mail");

						return Promise.resolve(user);
					}
				},		
				
				/**
				 * Varify account.
				 *
				 * @actions
				 * @param {String} token - Token
				 *
				 * @returns {Object} - User entity
				 */
				verify: {
					description: "Verify an account",
					rest: {
						method: "POST",
						path: "/verify",
					},
					params: {
						token: {
							type: "string",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						token: string
					}>): Promise<any> {
						const token:TokenModel = await ctx.call("v1.token.check", {
							type: TOKEN_TYPE_VERIFICATION,
							token: ctx.params.token
						});
						if (!token) {
							throw new Errors.MoleculerClientError(
								"Invalid_or_expired_verification_token",
								400,
								"INVALID_TOKEN"
							);
						}
						const db:UserEntityManager = new UserEntityManager(this.adapter);

						const user = await db.findByLogin(token.owner);
						
						checkUser(user, { noVerification: true });
						
						await db.enable(user);

						// Remove token
						await ctx.call("v1.token.remove", {
							type: TOKEN_TYPE_VERIFICATION,
							token: ctx.params.token
						});

						// Send welcome email
						// No need to wait it.
						this.sendMail(ctx, user, "welcome");
						
						return Promise.resolve(user);
					}
				},	
				
				/**
				 * Enable account.
				 *
				 * @actions
				 * @param {String} id - User Id
				 *
				 * @returns {Object} - User entity
				 */
				 enable: {
					description: "Enable account",
					rest: {
						method: "POST",
						path: "/enable",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						id: string
					}>): Promise<any> {
						const db:UserEntityManager = new UserEntityManager(this.adapter);
						const user = await db.find(ctx.params.id);
						
						if (user.active)
							throw new Errors.MoleculerClientError(
								"Account_has_already_been_enabled",
								400,
								"ERR_USER_ALREADY_ENABLED"
							);
							
						return Promise.resolve(await db.enable(user));
					}
				},
				
				/**
				 * Disable account.
				 *
				 * @actions
				 * @param {String} id - User Id
				 *
				 * @returns {Object} - User entity
				 */
				 disable: {
					description: "Disable account",
					rest: {
						method: "POST",
						path: "/enable",
					},
					params: {
						id: {
							type: "number",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						id: string
					}>): Promise<any> {
						const db:UserEntityManager = new UserEntityManager(this.adapter);
						const user = await db.find(ctx.params.id);
						
						if (!user.active)
							throw new Errors.MoleculerClientError(
								"Account_has_already_heen_disabled",
								400,
								"ERR_USER_ALREADY_ENABLED"
							);
							
						return Promise.resolve(await db.disable(user));
					}
				},
				
				/**
				 * Start recovery password.
				 *
				 * @actions
				 * @param {String} email - User Email
				 *
				 * @returns {Boolean} - true
				 */
				forgotPassword: {
					description: "Start the 'forgot password' process",
					rest: {
						method: "POST",
						path: "/forgot-password",
					},
					params: {
						email: {
							type: "email",
							optional: false,
							require:true
						}
					},
					async handler(ctx: Context<{
						email: string
					}>): Promise<any> {
						const user = await new UserEntityManager(this.adapter).findByEmail(ctx.params.email);
						checkUser(user);

						// Generate a reset token
						const token:any = await ctx.call("v1.token.generate", {
							type:TOKEN_TYPE_PASSWORD_RESET,
							owner:JSON.stringify(user),
							expiry: TOKEN_EXPIRATION
						});

						// Send a passwordReset email
						await this.sendMail(ctx, user, "reset-password", { token:token });

						return Promise.resolve(true);
					}
				},
				
				/**
				 * Reset forgotten password.
				 *
				 * @actions
				 * @param {String} token - Token (Start recovery password)
				 * @param {String} email - User Email
				 *
				 * @returns {String} - Token
				 */
				resetPassword: {
					description: "Reset forgotten password",
					rest: {
						method: "GET",
						path: "/forgot-password",
					},
					params: {						
						token: {
							type: "string",
							optional: false,
							require:true
						},
						password: {
							type: "string",
							optional: false,
							require:true,
							min:6
						}
					},
					async handler(ctx: Context<{
						token: string,
						password: string,
					}>): Promise<any> {
						const token:TokenModel = await ctx.call("v1.token.check", {
							type: TOKEN_TYPE_PASSWORD_RESET,
							token: ctx.params.token
						});
						if (!token) {
							throw new Errors.MoleculerClientError(
								"Invalid_or_expired_password_reset_token",
								400,
								"INVALID_TOKEN"
							);
						}

						let user = await this.resolveEntities(ctx, { id: token.owner });
						checkUser(user, { noVerification: true });
						
						const data = await new UserEntityManager(this.adapter).updatepassword(null, ctx.params.password, user);
						
						// Remove token
						await ctx.call("v1.tokens.remove", {
							type: TOKEN_TYPE_PASSWORD_RESET,
							token: ctx.params.token
						});

						// Send password-changed email
						this.sendMail(ctx, user, "password-changed");
						return Promise.resolve(await generateAuthToken(ctx, user));
					}
				},
			}
		}); 
	}
	
}
