"use strict";
import "reflect-metadata";
import {Context, Errors, Service, ServiceBroker} from "moleculer";
import multer from 'multer';
import util from 'util';
import { isString } from "class-validator";
import storage from "../utils/storage.utils";
import FileModel from "./../orm/models/file.model";

export default class UploadService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "upload",
			version: 1,
			actions:{
				submit: {
					rest: {
						method: "POST",
						path: "/submit"
					},
					async handler({ params }) {
						await broker.call(
							"upload.upload",
							params.req, params.res
						).then((message:any)=>{
							try{
								if(message){
									if (!isString(message) && "dataValues" in message){
										params.res.end(JSON.stringify(message));
									}else if (!isString(message) && "file" in message){
										params.res.end(JSON.stringify(message));
									}else{
										params.res.end(message);
									}
								}else{
									params.res.end(message);
								}
							}catch(error){
								console.log(error);
								params.res.end(message);
							}							
						});
					}
				},
				upload: {
					rest: {
						method: "POST",
						path: "/"
					},
					async handler({ params }) {
						return await this.upload(params);
					},
				},
				info: {
					description: "Get File infos",
					rest: {
						method: "GET",
						path: "/info",
					},
					params: {
						file: "string|required",
					},
					async handler(ctx: any): Promise<any> {
					}
				},
				commit: {
					description: "save tmp file to final path",
					rest: {
						method: "POST",
						path: "/commit",
					},
					params: {
						path: {
							type: "string",
							optional: false,
							require:true
						},
						owner: {
							type: "string",
							optional: false,
							require:true
						},
					},
					async handler(ctx: Context<{
						path: string,
						owner:string
						}>): Promise<any> {
							const files:FileModel = await storage.save(ctx.params.path);
						return Promise.resolve(files);
					}
				},
			},
			methods: {
				async upload(req, res) {
			
					let message = null;
					try {
						var filename:string;
						const promisify:any = (await storage.upload((value:string)=>{
							filename = value;
						}, /\.(JPG|jpg|jpeg|png|gif|pdf)$/, "Only image and pdf files are allowed!")).fields([
							{ name: "file", maxCount: 1 },
							{ name: "files", maxCount: 8 },
						]);
						const upload = util.promisify(promisify);
						const m = await upload(req, res);
						if(storage.check(filename )){
							return {file:filename};
						}else{
							throw new Errors.MoleculerClientError(
								`Unable to store file`,
								500,
								"Error"
							);
						}
						// Insert your logic here after upoading files
						// you can also access req.body stuff and req.params as well
						return m;
					} catch (err) {
						if (err instanceof multer.MulterError) {
							// A Multer error occurred when uploading.
							if (err.code == "LIMIT_UNEXPECTED_FILE") {
								throw new Errors.MoleculerClientError(
									`Unexpected Field: ${err.field}`,
									500,
									"Error"
								  );
							} else {
								throw new Errors.MoleculerClientError(
									err.message,
									500,
									"Error"
								  );
							}
						} else if (err) {
							// An unknown error occurred when uploading.
							throw new Errors.MoleculerClientError(
								err.message,
								500,
								"Error"
							  );
						}
						message = err.message;
						return message;
					}
				}
			},
		});
	}
}
