import multer from "multer";
import path from "path";
import * as fs from 'fs';
import { secureToken } from "./jwt.utils";
import mime from "mime-types";
import FileModel from "../orm/models/file.model";

const getbase = ()=>{
  if (!fs.existsSync("upload")){
    fs.mkdirSync("upload");
  }
  if (!fs.existsSync(path.join("upload", "/", "tmp"))){
    fs.mkdirSync(path.join("upload", "/", "tmp"));
  }
  return 'upload/tmp';
}

const getbaseFinal = ()=>{
  if (!fs.existsSync("upload")){
    fs.mkdirSync("upload");
  }
  if (!fs.existsSync(path.join("upload", "/", "real"))){
    fs.mkdirSync(path.join("upload", "/", "real"));
  }
  return 'upload/real';
}

const getFolder = ()=>{
  let doc = new Date().getFullYear()+"";
    if (!fs.existsSync(path.join(getbaseFinal(), "/", doc))){
      fs.mkdirSync(path.join(getbaseFinal(), "/", doc));
    }
    doc = path.join(doc, "/", ""+new Date().getMonth());
    if (!fs.existsSync(path.join(getbaseFinal(), "/", doc))){
      fs.mkdirSync(path.join(getbaseFinal(), "/", doc));
    }
    doc = path.join(doc, "/", ""+new Date().getDate());
    if (!fs.existsSync(path.join(getbaseFinal(), "/", doc))){
      fs.mkdirSync(path.join(getbaseFinal(), "/", doc));
    }
    return doc;
}

export default {
  /**
   * check if file exists
   * 
   * @param docpath 
   * @param docfile 
   * @returns 
   */
  check:(docfile:string)=>{
    return fs.existsSync(path.join(getbase(), "/", docfile));
  },
  //read file if exists
  read: (docpath:string)=>{
    return fs.readFileSync(path.join(getbaseFinal(), "/", docpath));
  },
  //store file
  upload:async (filenameFunction:any, reg:any, error:any)=>{
    return multer({ fileFilter: (req: any, file: any, cb: any) => {
        if (reg && !file.originalname.match(reg)) {
            return cb(new Error(error), false);
        }
        cb(null, true);
      }, storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const doc = getbase();
          cb(null, doc);
          return doc;
      },
      filename: function (req, file, cb) {
        const filename = secureToken(file.fieldname + '-' + Date.now());
        filenameFunction(filename);
        cb(null, filename);
        return filename;
      }
    })});
  },
  save:(docfile:string):FileModel=>{
    const dest = path.join(getFolder() + "/", docfile);
    fs.renameSync( path.join(getbase(), "/", docfile),  path.join(getbaseFinal(), "/", dest));
    const stats = fs.statSync(path.join(getbaseFinal(), "/", dest));
    return {
      path:dest,
      name:docfile,
      mime:""+mime.lookup(path.join(getbaseFinal(), "/", dest)),
      size:stats.size,
    };
  }
};