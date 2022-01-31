"use strict";
import "reflect-metadata";
import {Service, ServiceBroker} from "moleculer";
import Cron from "moleculer-cron";
import { Console } from "console";

export default class UserService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "cron-job",
            version: 1,
			aliases:"cronjob",			
			mixins: [ Cron],
            crons: [ 
				{
					name: "JobClearExpiredToken",
					cronTime: "0 0 * * * *",
					onTick: /*"v1.token.clearExpired"*/function() {
						try{
							this.call("v1.token.clearExpired");
						}catch(err){
							console.log(err);
							this.logger.console.error(err);
						}
					},
					runOnInit: function() {
						console.log("JobClearExpiredToken is created");
					},
					manualStart: false,
					timeZone: 'Africa/Douala'
				}
			],
			actions: {
				clearExpired: {
                    visibility: "protected",
					async handler(ctx) {
						await ctx.call("v1.token.clearExpired");
					}
				}		
			}
		});
	}
}
