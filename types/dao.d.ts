import { ModelPopulateOptions, Model, Document, Query, ModelUpdateOptions } from 'mongoose'
import * as mongodb from 'mongodb'
import { seqModel, Maps, InsertWriteResult, AutoNumber, QueryOptions, ListData, UpdateWriteResult, DeleteWriteResult } from './';

/**
 * 查询器选项
 */
export interface KenoteMongooseQueryOptions {

  /**
   * 名称
   */
  name               ?: string

  /**
   * Populate 选项
   */
  populate           ?: ModelPopulateOptions | ModelPopulateOptions[]

  /**
   * 选择数据字段
   */
  select             ?: any

  /**
   * 列表时，排序规则
   */
  sort               ?: any

  /**
   * 列表时，取的记录条数
   */
  limit              ?: number

  /**
   * 列表时，跳过的记录条数
   */
  skip               ?: number

  /**
   * seqModel
   */
  seqModel           ?: Model<Document, {}>
}

/**
 * 自动编号配置
 */
export interface KenoteMongooseAutoNumber {

  /**
   * 键名
   */
  idName             ?: string

  /**
   * 起始数
   */
  idStart            ?: number

  /**
   * 步进数
   */
  idStep             ?: number
}

/**
 * seqDocument
 */
export interface KenoteMongooseSeqDocument extends Document {

  /**
   * 自动编号对应的表
   */
  name                : string

  /**
   * 自动编号的索引值
   */
  seq                 : number
}

/**
 * 数据列表集合，用于分页
 */
export interface KenoteMongooseListData extends Maps<any> {

  /**
   * 分页数据列表
   */
  data                : Document[]

  /**
   * 数据总条数
   */
  counts              : Query<number>

  /**
   * 取的记录条数
   */
  limit               : number
}

/**
 * 更新数据的返回结果
 */
export interface KenoteMongooseUpdateWriteResult extends InsertWriteResult { 
  nModified           : number 
}

/**
 * 删除数据的返回结果
 */
export interface KenoteMongooseDeleteWriteResult extends InsertWriteResult { 
  deletedCount        : number 
}

/**
 * 插入数据的返回结果
 */
export interface KenoteMongooseInsertWriteResult { 
  ok                  : number
  n                   : number
}

/**
 * Mongoose Dao层
 */
export declare class KenoteMongooseMongooseDao {

  /**
   * 名称
   */
  public name: string

  /**
   * 自动编号配置
   */
  private autoNmber?: AutoNumber

  /**
   * Mongoose Model层
   */
  public model: Model<Document, {}>

  /**
   * 查询器选项
   */
  public options: QueryOptions

  /**
   *  seqModel
   */
  public seqModel: Model<Document, {}>

  /**
   * 初始化构造
   * @param model mongoose.Model<mongoose.Document, {}>
   * @param options QueryOptions
   */
  constructor (model: Model<Document, {}>)
  constructor (model: Model<Document, {}>, options: QueryOptions)

  /**
   * 创建数据文档
   * @param doc any
   * @param populate mongoose.ModelPopulateOptions
   * @returns Promise<mongoose.Document>
   */
  public create (doc: any): Promise<Document>
  public create (doc: any, populate: ModelPopulateOptions): Promise<Document>

  /**
   * 创建数据文档(自动编号)
   * @param doc any
   * @param populate mongoose.ModelPopulateOptions
   * @returns Promise<mongoose.Document>
   */
  public insert (doc: any): Promise<Document>
  public insert (doc: any, populate: ModelPopulateOptions): Promise<Document>

  /**
   * 查询单条数据
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<mongoose.Document | null>
   */
  public findOne (conditions: any): Promise<Document | null>
  public findOne (conditions: any, options: QueryOptions): Promise<Document | null>

  /**
   * 查询多条数据（列表）
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<mongoose.Document[]>
   */
  public find (): Promise<Document[]>
  public find (conditions: any): Promise<Document[]>
  public find (conditions: any, options: QueryOptions): Promise<Document[]>

  /**
   * 查询多条数据的总条数
   * @param conditions any
   * @returns Promise<mongoose.Query<number>>
   */
  public counts (): Promise<Query<number>>
  public counts (conditions: any): Promise<Query<number>>

  /**
   * 数据分页列表
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<ListData | Maps<any>>
   */
  public list (): Promise<ListData | Maps<any>>
  public list (conditions: any): Promise<ListData | Maps<any>>
  public list (conditions: any, options: QueryOptions): Promise<ListData | Maps<any>>

  /**
   * 更新单条数据
   * @param conditions any
   * @param doc any
   * @param options mongoose.ModelUpdateOptions
   * @returns Promise<mongoose.Query<any>>
   */
  public updateOne (conditions: any, doc: any): Promise<Query<UpdateWriteResult>>
  public updateOne (conditions: any, doc: any, options: ModelUpdateOptions): Promise<Query<UpdateWriteResult>>

  /**
   * 更新多条数据
   * @param conditions any
   * @param doc any
   * @param options mongoose.ModelUpdateOptions
   * @returns Promise<mongoose.Query<any>>
   */
  public update (conditions: any, doc: any): Promise<Query<UpdateWriteResult>>
  public update (conditions: any, doc: any, options: ModelUpdateOptions): Promise<Query<UpdateWriteResult>>

  /**
   * 批量操作
   * @param writes: any[]
   * @returns Promise<mongodb.BulkWriteOpResultObject>
   * @description https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite
   */
  public bulkWrite (writes: any[]): Promise<mongodb.BulkWriteOpResultObject>

  /**
   * 删除数据文档
   * @param conditions any
   * @returns Promise<mongoose.Query<any>>
   */
  public remove (): Query<DeleteWriteResult>
  public remove (conditions: any): Query<DeleteWriteResult>

  /**
   * 清除数据文档
   */
  public clear (): Promise<void>

  /**
   * ID 自动递增
   * @param name string
   * @param start number
   * @returns Promise<number>
   */
  private addAndUpdateKeys (name: string): Promise<number>
  private addAndUpdateKeys (name: string, start: number): Promise<number>

}

/**
 * 设置自动编号
 * @param setting AutoNumber
 */
export declare function KenoteMongooseautoNumber (setting: AutoNumber): any

/**
 * Promise 回调
 * @param resolve (thenableOrResult?: any) => void
 * @param reject (error?: any) => void
 * @param err Error
 * @param doc any
 */
export declare function KenoteMongooseCallback (resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void, err: Error, doc: any): void