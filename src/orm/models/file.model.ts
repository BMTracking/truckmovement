'use strict'
/**
 * FileModel
 */
export default interface FileModel{
    id?:any;
    owner?:string;
    path:string;
    name:string;
    mime:string;
    size:number;
    createdDate?:Date;
    updateDate?:Date;
    deleteDate?:Date;
}