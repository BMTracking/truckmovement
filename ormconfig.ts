import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({path: './.env'});

export const base: ConnectionOptions = {
    name:"default",
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
};

module.exports =base;

export default base;