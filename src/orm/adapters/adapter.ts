import {
    createConnection,
    ConnectionOptions,
    Connection,
    EntitySchema,
    Repository,
    FindOneOptions,
    DeepPartial, FindConditions, FindManyOptions
} from 'typeorm';
import * as Moleculer from 'moleculer';
/* tslint:disable-next-line */
import {Service, ServiceBroker} from 'moleculer';

interface IndexMap {
    [key: string]: string;
}
/**
 * TypeOrmDbAdapter
 * 
 * Database Adapter using typeorm for Moleculer
 */
export class TypeOrmDbAdapter<T> {
    public broker: Moleculer.ServiceBroker;
    public service: Moleculer.Service;
    public repository: Repository<T>;
    public connection: Connection;
    private opts: ConnectionOptions;
    private entity: EntitySchema<T>;

    constructor(opts: ConnectionOptions) {
        this.opts = opts;
    }
    /**
     * 
     * @param filters 
     * @returns 
     */
    public find(filters: any) {
        return this.createCursor(filters, false);
    }
    /**
     * 
     * @param query 
     * @returns 
     */
    public findOne(query: FindOneOptions) {
        return this.repository.findOne(query);
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    public findById(id: number) {
        return this.repository.findByIds([id]).then((result) => Promise.resolve(result[0]));
    }
    /**
     * 
     * @param idList 
     * @returns 
     */
    public findByIds(idList: any[]) {
        return this.repository.findByIds(idList);
    }
    /**
     * 
     * @param filters 
     * @returns 
     */
    public count(filters = {}) {
        return this.createCursor(filters, true);
    }
    /**
     * 
     * @param entity 
     * @returns 
     */
    public insert(entity: any) {
        return this.repository.save(entity);
    }
    /**
     * 
     * @param entity 
     * @returns 
     */
    public create(entity: any) {
        return this.insert(entity);
    }
    /**
     * 
     * @param entities 
     * @returns 
     */
    public insertMany(entities: any[]) {
        return Promise.all(entities.map((e) => this.repository.create(e)));
    }
    /**
     * 
     * @param entity 
     * @param _idField 
     * @returns 
     */
    public beforeSaveTransformID(entity: T, _idField: string) {
        return entity;
    }
    /**
     * 
     * @param entity 
     * @param _idField 
     * @returns 
     */
    public afterRetrieveTransformID(entity: T, _idField: string) {
        return entity;
    }
    /**
     * 
     * @param broker 
     * @param service 
     */
    public init(broker: ServiceBroker, service: Service) {
        this.broker = broker;
        this.service = service;
        const entityFromService = this.service.schema.model;
        const isValid = !!entityFromService.constructor;
        if (!isValid) {
            throw new Error('if model provided - it should a typeorm repository');
        }
        this.entity = entityFromService;

    }
    /**
     * 
     * @returns 
     */
    public connect() {
        const connectionPromise = createConnection({
            entities: [this.entity],
            synchronize: true,
            ...this.opts

        });
        return connectionPromise.then((connection) => {
            this.connection = connection;
            this.repository = this.connection
                .getRepository(this.entity);
        });
    }
    /**
     * 
     * @returns 
     */
    public disconnect() {
        if (this.connection) {
            return this.connection.close();
        }
        return Promise.resolve();
    }
    /**
     * 
     * @param where 
     * @param update 
     * @returns 
     */
    public updateMany(where: FindConditions<T>, update: DeepPartial<T>) {
        const criteria: FindConditions<T> = {where} as any;
        return this.repository.update(criteria,<any>  update);
    }
    /**
     * 
     * @param id 
     * @param update 
     * @returns 
     */
    public updateById(id: number, update: { $set: DeepPartial<T> }) {
        return this.repository.update(id, <any> update.$set);
    }
    /**
     * 
     * @param where 
     * @returns 
     */
    public removeMany(where: FindConditions<T>) {
        return this.repository.delete(where);
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    public removeById(id: number) {
        const result = this.repository.delete(id);
        return result.then(() => {
            return {id};
        });
    }
    /**
     * 
     * @returns 
     */
    public clear() {
        return this.repository.clear();
    }
    /**
     * 
     * @param entity 
     * @returns 
     */
    public entityToObject(entity: T) {
        return entity;
    }
    /**
     * 
     * @param params 
     * @param isCounting 
     * @returns 
     */
    public createCursor(params: any, isCounting: boolean = false) {
        if (params) {
            const query: FindManyOptions<T> = {
                where: params.query || {}
            };
            this._enrichWithOptionalParameters(params, query);

            return this._runQuery(isCounting, query);
        }

        return this._runQuery(isCounting);
    }
    /**
     * 
     * @param isCounting 
     * @param query 
     * @returns 
     */
    private _runQuery(isCounting: boolean, query?: FindManyOptions<T>) {
        if (isCounting) {
            return this.repository.count(query);
        }
        else {
            return this.repository.find(query);
        }
    }
    /**
     * 
     * @param params 
     * @param query 
     */
    private _enrichWithOptionalParameters(params: any, query: FindManyOptions<T>) {
        if (params.search) {
            throw new Error('Not supported because of missing or clause meanwhile in typeorm');
        }

        if (params.sort) {
            const sort = this.transformSort(params.sort);
            if (sort) {
                query.order = sort as any;
            }
        }

        if (Number.isInteger(params.offset) && params.offset > 0) {
            query.skip = params.offset;
        }

        if (Number.isInteger(params.limit) && params.limit > 0) {
            query.take = params.limit;
        }
    }
    /**
     * 
     * @param paramSort 
     * @returns 
     */
    private transformSort(paramSort: string | string[]): { [columnName: string]: ('ASC' | 'DESC') } {
        let sort = paramSort;
        if (typeof sort === 'string') {
            sort = sort.replace(/,/, ' ').split(' ');
        }
        if (Array.isArray(sort)) {
            const sortObj: IndexMap = {};
            sort.forEach((s) => {
                if (s.startsWith('-')) {
                    sortObj[s.slice(1)] = 'DESC';
                }
                else {
                    sortObj[s] = 'ASC';
                }
            });
            // @ts-ignore
            return sortObj;
        }

        if (typeof sort === 'object') {
            return sort;
        }
        return {};
    }
}