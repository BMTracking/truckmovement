'use strict'
/**
 * CompanyModel
 */
export default interface CompanyModel{
    id?:any;
    user_id?:any;
    bank_id?:any;
    activity_id:any;
    country_id:any;
    area_id:any;
    city_id:any;
    type?:number;
    niu?:string;
    name:string;
    phone1:string;
    phone2?:string;
    email:string;
    pobox?:string;
    website?:string;
    address1:string;
    address2?:string;
    longitude?:number;
    latitude?:number;
    bank_code?:string;
    bank_key?:string;
    bank_doc?:string;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}