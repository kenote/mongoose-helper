
import { MongoDB as mongoDB, MongoSetting as mongoSetting, ModelMount as modelMonut } from './base'
import { MongooseDao as mongooseDao, MongooseDaoSetting as mongooseDaoSetting, QueryOptions as queryOptions, callback as Callback } from './dao'

export declare class MongoDB extends mongoDB {}

export declare const MongoSetting: typeof mongoSetting

export declare const ModelMount: typeof modelMonut

export declare class MongooseDao extends mongooseDao {}

export declare const MongooseDaoSetting: typeof mongooseDaoSetting

export declare interface QueryOptions extends queryOptions {}

export declare const callback: typeof Callback