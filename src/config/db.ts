import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});


export const base = (name:string):ConnectionOptions=>{
    return {
        name:name,
        type: "mysql",
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
        logging:process.env.MYSQL_LOGGING === 'true',
        debug:false,
        migrationsRun: process.env.MYSQL_MIGRATIONS_RUN === 'true',
        "entities":String(process.env.MYSQL_ENTITIES).split(','),
        "migrations": String(process.env.MYSQL_MIGRATIONS).split(','),
        "subscribers": String(process.env.MYSQL_SUBSCRIBERS).split(','),
        "cli": {
            "entitiesDir": process.env.MYSQL_ENTITIES_DIR,
            "migrationsDir": process.env.MYSQL_MIGRATIONS_DIR,
            "subscribersDir": process.env.MYSQL_SUBSCRIBERS_DIRsrc,
        }
    }
};

export const token = (name:string):ConnectionOptions=>{
    return {
        name:name,
        type: "mysql",
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
        logging:process.env.MYSQL_LOGGING === 'true',
        debug:false,
        migrationsRun: process.env.MYSQL_MIGRATIONS_RUN === 'true',
        "entities":String(process.env.MYSQL_ENTITIES).split(','),
        "migrations": String(process.env.MYSQL_MIGRATIONS).split(','),
        "subscribers": String(process.env.MYSQL_SUBSCRIBERS).split(','),
        "cli": {
            "entitiesDir": process.env.MYSQL_ENTITIES_DIR,
            "migrationsDir": process.env.MYSQL_MIGRATIONS_DIR,
            "subscribersDir": process.env.MYSQL_SUBSCRIBERS_DIRsrc,
        }
    }
};

export const token2: ConnectionOptions = {
    name:"mongo",
    type: "mongodb",
    host: process.env.MONGO_HOST,
    port: Number(process.env.MONGO_PORT),
    database: process.env.MONGO_DATABASE,
    /*username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,*/
    synchronize: process.env.MONGO_SYNCHRONIZE === 'true',
    logging:process.env.MONGO_LOGGING === 'true',
    migrationsRun: process.env.MONGO_MIGRATIONS_RUN === 'true',
    "entities":String(process.env.MONGO_ENTITIES).split(','),
    "migrations": String(process.env.MONGO_MIGRATIONS).split(','),
    "subscribers": String(process.env.MONGO_SUBSCRIBERS).split(','),
    "cli": {
        "entitiesDir": process.env.MONGO_ENTITIES_DIR,
        "migrationsDir": process.env.MONGO_MIGRATIONS_DIR,
        "subscribersDir": process.env.MONGO_SUBSCRIBERS_DIRsrc,
    }
};