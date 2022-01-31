"use strict";
import "reflect-metadata";
import {Service, ServiceBroker} from "moleculer";

/**
 * @name - Mail Service
 * @description - Send email
 */
export default class MailService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "mail",
            version: 1,
			aliases:"mail",
			settings: {
				$secureSettings: ["transport.auth.user", "transport.auth.pass"],		
				from: process.env.MAIL_FROM,
				transport: {
					host: process.env.MAIL_HOST,
					port: process.env.MAIL_PORT,
					ignoreTLS: process.env.MAIL_SECURE === 'false',
					auth: {
						user: process.env.MAIL_USERNAME,
						pass: process.env.MAIL_PASSWORD
					}
				},
				templateFolder: "./src/assets/templates/mail"
			},
			events: {
				//Send email to Administrateur when new user is registred
				"user.registred": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("User registred!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new user is created
				"user.created": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("User created!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new user is removed
				"user.deleted": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("User deleted!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new role is removed
				"role.created": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("Role created!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new role is removed
				"role.deleted": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("Role deleted!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new permission is removed
				"permission.created": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("Permission created!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new permission is removed
				"permission.deleted": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("Permission deleted!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new permission is removed
				"rolepermission.created": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("RolePermission created!!!!!::  ",payload);
						// ...
					}
				},
				//Send email to Administrateur when new permission is removed
				"rolepermission.deleted": {
					// Register handler to the "mail"
					group: "mail",
					handler(payload:any) {
						console.log("RolePermission deleted!!!!!::  ",payload);
						// ...
					}
				},
			}
		});
	}
}
