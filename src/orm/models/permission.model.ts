'use strict'
/**
 * PermissionModel
 */
export default interface PermissionModel{
    id?:any;
    service:string;
    path:string;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}