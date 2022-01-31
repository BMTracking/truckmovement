'use strict'
/**
 * TokenModel
 */
export default class TokenModel{
  //public id?:any;
  public token: string;
  public type: string;
  public owner: string;
  public expiry: number;
  public createdAt?: Date;
  public lastUsedAt?: Date;
}