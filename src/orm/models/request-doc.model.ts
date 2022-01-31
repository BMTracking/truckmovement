'use strict'
/**
 * RequestDocModel
 */
export default interface RequestDocModel{
    id?:any;
    customer_id?:any;
    request_id?:any;
    doctype_id?:any;
    path:string;
    name:string;
    mime:string;
    size:number;
    createdDate?:Date;
    updateDate?:Date;
    deleteDate?:Date;
}