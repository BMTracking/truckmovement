import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import {Errors} from "moleculer";
import * as fs from 'fs';
import * as path from 'path';
import UserModel from './../orm/models/user.model';
import crypto from "crypto";
import { TOKEN_EXPIRATION, TOKEN_TYPE_API_KEY } from '../config/const';


/**
 *  generates JWT
 *
 * @actions
 * @param user - User Entity value
 *
 * @returns {UserModel} User entity
 */
export function generateToken(user:UserModel) {
  // information to be encoded in the JWT
  // read private key value
  const privateKey = fs.readFileSync('./src/assets/jwt/private.pem');
  const signInOptions: SignOptions = {
    // RS256 uses a public/private key pair. The API provides the private key
    // to generate the JWT. The client gets a public key to validate the
    // signature
    algorithm: 'HS256',
    expiresIn: '1h'
  };

  // generate JWT
  return sign(user, privateKey, signInOptions);
};

/**
 * Validate token
 *
 * @actions
 * @param token
 *
 * @returns {UserModel} User entity
 */
export function validateToken(token: string): Promise<UserModel> {
    const publicKey = fs.readFileSync('./src/assets/jwt/private.pem');
  
    const verifyOptions: VerifyOptions = {
      algorithms: ['HS256']
    };
  
    return new Promise((resolve, reject) => {
      verify(token, publicKey, verifyOptions, (error, decoded: UserModel) => {
        if (error) return reject(error);
  
        resolve(decoded);
      })
    });
}

/**
 * Generate token
 *
 * @actions
 * @param token
 *
 * @returns {string} SH256 key
 */
export function secureToken(token:string) {
    const hmac = crypto.createHmac("sha256", "K4nTa3");
    hmac.update(token);
    return hmac.digest("hex");
}

/**
 * Check User.
 *
 * @actions
 * @param user 
 * @param opts 
 *
 * @returns {Boolean} true
 */
 export function checkUser(user:UserModel, opts = {noVerification:false }) {
		
  if (!user) {
    throw new Errors.MoleculerClientError(
      "Account is not registered.",
      400,
      "ACCOUNT_NOT_FOUND"
    );
  }

  if (!opts.noVerification && !user.verified) {
    throw new Errors.MoleculerClientError(
      "Please activate your account.",
      400,
      "ACCOUNT_NOT_VERIFIED"
    );
  }

  if (!user.active) {
    throw new Errors.MoleculerClientError("Account is disabled.", 400, "ACCOUNT_DISABLED");
  }
}

	/**
	 * Generate JWT token
	 *
	 * @actions
	 * @param ctx - Context 
	 * @param user - User 
	 *
	 * @returns {Boolean} true
	 */
  export async function generateAuthToken(ctx:any, user:UserModel){
		// Generate a reset token
		const token:any = await ctx.call("v1.token.generate", {
			type:TOKEN_TYPE_API_KEY,
			owner:JSON.stringify(user),
			expiry: TOKEN_EXPIRATION
		});
		return {token:token.token, expiry: token.expiry, user:user};
	} 