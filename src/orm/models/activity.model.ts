'use strict'
/**
 * ActivityModel
 */
export default interface ActivityModel{
    id?:any;
    name:string;
    description:string;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}