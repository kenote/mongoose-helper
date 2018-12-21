
import { MongoDB as mongoDB, MongoSetting as IMongoSetting, ModelMount as modelMonut, mongoSetting as ImongoSetting } from './base'
import { MongooseDao as mongooseDao, MongooseDaoSetting as mongooseDaoSetting, QueryOptions as queryOptions, callback as Callback } from './dao'

export declare class MongoDB extends mongoDB {}

export declare const MongoSetting: typeof IMongoSetting

export declare interface mongoSetting extends ImongoSetting {}

export declare const ModelMount: typeof modelMonut

export declare class MongooseDao extends mongooseDao {}

export declare const MongooseDaoSetting: typeof mongooseDaoSetting

export declare interface QueryOptions extends queryOptions {}

export declare const callback: typeof Callback