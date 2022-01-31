import {IncomingMessage} from "http";
import {Service, ServiceBroker, Context} from "moleculer";
import ApiGateway from "moleculer-web";
import authenticate from "./../middleware/authenticate";
import authorize from "./../middleware/authorize";
import history from "connect-history-api-fallback";
import UserModel from "./../orm/models/user.model";
import { keyPath, certificatePath } from "../utils/ssl.util";
import { isString } from "class-validator";
import { ENABLE_ACL_FILTER } from "../config/const";
//import AVService from "moleculer-antivirus";

//import cookie from "cookie";
const NO_RESTRICTIOn_ROUTES = ['v1.account.login'];

export default class ApiService extends Service {

	public constructor(broker: ServiceBroker) {
		super(broker);
		// @ts-ignore
		this.parseServiceSchema({
			name: "api",
			version: 1,
			validation: true,
			mixins: [ApiGateway/*, AVService*/],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 3000,
				host:"0.0.0.0",
				// HTTPS server with certificate
				https: {
					key: keyPath(),
					cert: certificatePath()
				},
				// Use HTTP2 server (experimental)
				http2: false,
				optimizeOrder: true,
				routes: [
					{
						path: "/api",
						whitelist: [
							"**"
							// Access to any actions in all services under "/api" URL
							/*"account.**",
							"area.**",
							"city.**",
							"country.**",
							"permission.**",
							"role-permission.**",
							"role.**",
							"user.**",*/
						],
						etag: true,

						camelCaseNames: true,

						// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
						use: [],
						// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
						mergeParams: true,

						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: true,

						// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
						authorization: ENABLE_ACL_FILTER,

						// The auto-alias feature allows you to declare your route alias directly in your services.
						// The gateway will dynamically build the full routes from service schema.
						autoAliases: true,

						aliases:{
							//"POST /local":"v1.account.login"
						},

						onBeforeCall(ctx:any, route:any, req:any, res:any) {
							this.logger.info("onBeforeCall in protected route");
							ctx.meta.authToken = req.headers["authorization"];
							ctx.meta.sLocale = "en";
							if(ctx.params && ctx.params.slocale){
								ctx.meta.sLocale = ctx.params.slocale === "fr"?"fr":"en";
							}
						},

						//onAfterCall(ctx:any, route:any, req:any, res:any, data:any) {
							/*this.logger.info("onAfterCall in protected route");
							res.setHeader("X-Custom-Header", "Authorized path");
							return data;*/
						//},

						// Route error handler
						/*onError(req:any, res:any, err:any) {
							console.log(err);
							/*res.setHeader("Content-Type", "text/plain");
							res.writeHead(err.code || 500);
							res.end("Route error: " + err.message);*/
						//},
						/**
						 * Before call hook. You can check the request.
						 * @param {Context} ctx
						 * @param {Object} route
						 * @param {IncomingMessage} req
						 * @param {ServerResponse} res
						 * @param {Object} data
						onBeforeCall(ctx: Context<any,{userAgent: string}>,
						route: object, req: IncomingMessage, res: ServerResponse) {
						Set request headers to context meta
						ctx.meta.userAgent = req.headers["user-agent"];
						},
						*/

						/**
						 * After call hook. You can modify the data.
						 * @param {Context} ctx
						 * @param {Object} route
						 * @param {IncomingMessage} req
						 * @param {ServerResponse} res
						 * @param {Object} data
						 *
						 onAfterCall(ctx: Context, route: object, req: IncomingMessage, res: ServerResponse, data: object) {
						// Async function which return with Promise
						return doSomething(ctx, res, data);
					},
						*/

						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: "all", // Available values: "all", "restrict"

						// Enable/disable logging
						logging: true,
					},

					/**
					 * Static routes
					 */
					{
						path: "/upload",
						use: [/*history(), */ApiGateway.serveStatic("protected", {})],
						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: true,

						// You should disable body parsers
						/*bodyParsers: {
							json: false,
							urlencoded: false
						},*/
						onError(req:any, res:any, err:any) {
							console.log(err);
							/*res.setHeader("Content-Type", "text/plain");
							res.writeHead(err.code || 500);
							res.end("Route error: " + err.message);*/
						},
		
						aliases: {
							async "POST /single"(req:any, res:any){
								await req.$ctx.call(
									"v1.upload.upload",
									req, res
								).then((message:any)=>{
									try{
										if(message){
											if (!isString(message) && "dataValues" in message){
												res.end(JSON.stringify(message));
											}else if (!isString(message) && "file" in message){
												res.end(JSON.stringify(message));
											}else{
												res.end(message);
											}
										}else{
											res.end(message);
										}
									}catch(error){
										console.log(error);
										res.end(message);
									}
									
								});
							},

							// File upload from HTML multipart form
							"POST /": "multipart:v1.upload.upload",
							
							// File upload from AJAX or cURL
							"PUT /:id": "stream:v1.upload.upload",
		
							// File upload from HTML form and overwrite busboy config
							"POST /multi": {
								type: "multipart",
								// Action level busboy config
								busboyConfig: {
									limits: { files: 3 }
								},
								action: "v1.upload.upload"
							}
						},
		
						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {
							retries: 3,
						},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: "all", // Available values: "all", "restrict"

						// Enable/disable logging
						logging: true,
					},

					/**
					 * Upload file route
					 */
					{
						path: "/static",
						use: [/*history(), */ApiGateway.serveStatic("public", {})],
						mappingPolicy: "restrict"
						//logging: false
					},
				],
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: null,
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: null,
				// Serve assets from "public" folder
				assets: {
					folder: "public",
					// Options to `server-static` module
					options: {},
				}
			},
			methods: {

				/**
				 * Authenticate the request. It checks the `Authorization` token value in the request header.
				 * Check the token value & resolve the user by the token.
				 * The resolved user will be available in `ctx.meta.user`
				 *
				 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {any} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}
				 **/

				async authenticate(ctx, route, req) {
					try{
						if(NO_RESTRICTIOn_ROUTES.indexOf(req['$action'].name) > -1){
							//console.log("Login requried");
							return true;
						}else{
							return authenticate(ctx, route, req);
						}
					}catch(err){
						return authenticate(ctx, route, req);
					}
				},							 

				/**
				 * Authorize the request. Check that the authenticated user has right to access the resource.
				 *
				 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}
				 * **/

				// Second thing
				async authorize(ctx, route, req) {
					if(NO_RESTRICTIOn_ROUTES.indexOf(req['$action'].name) > -1){
						//console.log("Login authorized");
						return true;
					}else{
						//console.log("Autorize stating!!!");
						return authorize(broker, ctx, route, req);
						//ctx.meta.user
						/*
						// Read the token from header
						const user = ctx.meta.user;
						console.log(ctx.meta.user);
						// It check the `auth` property in action schema.
						// @ts-ignore
						if (req.$action.auth === "required" && !user) {
							throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", {
								error: "Unauthorized",
							});
						}

						let token;
						if (req.headers.authorization) {
							let type = req.headers.authorization.split(" ")[0];
							if (type === "Token") {
								token = req.headers.authorization.split(" ")[1];
							}
						}
						if (!token) {
							throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN, {
								error: "Unauthorized",
							});
						}
						// Verify JWT token
						return ctx.call("auth.resolveToken", { token })
							.then((user:any) => {
								if (!user)
									throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN, {
										error: "Unauthorized",
									});

								ctx.meta.user = user;
							});*/
					}
				}
		
			}

		});
	}
}
