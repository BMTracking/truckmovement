'use strict'
/**
 * AddressModel
 */
export default interface AddressModel{
    id:any;
    country_id:any;
    area_id:any;
    city_id:any;
    address:string;
    longitude?:number;
    lattitude?:number;
    createdDate:Date;
    updateDate:Date;
    deleteDate:Date;
}