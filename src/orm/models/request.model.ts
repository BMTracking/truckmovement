'use strict'
/**
 * RequestModel
 */
export default interface RequestModel{
    id?:any;
    transporter_id?:any;
    customer_id?:any;
    drop_date:Date;   
    delivery_date:Date;
    marchandise:string;
    transit:boolean;
    from_country_id:any;
    from_area_id:any;
    from_city_id:any;
    from_address:string;
    from_longitude?:number;
    from_lattitude?:number;
    to_country_id:any;
    to_area_id:any;
    to_city_id:any;
    to_address:string;
    to_longitude?:number;
    to_lattitude?:number;
    status:number;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}