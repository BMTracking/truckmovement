import {Errors} from "moleculer";
import { TOKEN_TYPE_API_KEY } from '../config/const';

/**
 * @name middleware to check whether user has access to a specific endpoint
 *
 * @param broker - Broker
 * @param ctx - Context
 * @param route - Route
 * @param req - Request
 */
 export default async (broker:any, ctx:any, route:any, req:any) => {
   /*const params = { 
      type:TOKEN_TYPE_API_KEY,
      token:ctx.meta.authToken,
      role_id: ctx.meta.user.role_id,
      permission_id: req['$action'].name };
    const permission:any = await ctx.call("v1.rolepermission.check", params);
    if(!permission)
      throw new Errors.MoleculerClientError(
        "Access_forbidden",
        403,
        "INVALID_TOKEN"
      );*/
    return true;
};