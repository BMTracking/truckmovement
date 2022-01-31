import { validateToken } from './../utils/jwt.utils';
import ApiGateway from "moleculer-web";
import UserModel from './../orm/models/user.model';
import cookie from "cookie";

/**
 * @name middleware to check whether user is connected (JWT authentication)
 *
 * @param ctx - Context
 * @param route - Route
 * @param req - Request
 */
 export default async (ctx:any, route:any, req:any) => {
  try {
    let jwt;

    // Get JWT token from Authorization header
    const auth = req.headers["authorization"];
    
		if (auth && auth.startsWith("Bearer ")) jwt = auth.slice('bearer'.length).trim();

    // Get JWT token from cookie
    if (!jwt && req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      jwt = cookies["jwt-token"];
    }

    // verify request has token
    if (!jwt) {
      throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.ERR_NO_TOKEN, null);
    }

    // verify token hasn't expired yet

    // Verify JWT token
    const user:UserModel = await ctx.call("v1.account.resolveToken", { token:jwt });
    //console.log("authenticate-decodedToken", user);
    if (user) {
      //console.log("user", user);
      ctx.meta.userID = user.id;
      // Reduce user fields (it will be transferred to other nodes)
      return user;
    }
  /*
    const decodedToken:UserModel = await validateToken(jwt);
    ctx.meta.user = decodedToken;
    ctx.meta.userID = decodedToken.id;
    return Promise.resolve(decodedToken);*/
  } catch (error) {
    console.error(error.name);
    if (error.name === 'TokenExpiredError') {      
      throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.ERR_INVALID_TOKEN, null);
    }  
    throw error;
  }
  throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN, null);
};