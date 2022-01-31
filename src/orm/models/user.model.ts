'use strict'

/**
 * UserModel
 */
export default interface UserModel{
    id?:any;
    login?:string;
    password?:string;
    name:string;
    email?:string;
    phone?:string;
    address?:string;
    role_id?:any;
    company_id?:any;
    verified?:boolean;
    active?:boolean;
    autorizations?:string[]
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}