'use strict'
/**
 * RolePermissionModel
 */
export default interface RolePermissionModel{
    id?:any;
    role_id:any;
    permission_id:string;
    createdAt?:Date;
    updatedAt?:Date;
    deletedAt?:Date;
}