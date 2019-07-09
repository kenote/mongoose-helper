import * as Bluebird from 'bluebird'
import * as mongoose from 'mongoose'
import * as mongodb from 'mongodb'
import { zipObject } from 'lodash'
import { seqModel } from './'
import { QueryOptions, AutoNumber, seqDocument, Maps, ListData, UpdateWriteResult, InsertWriteResult, DeleteWriteResult } from '../types'

/**
 * Mongoose Dao层
 */
export class MongooseDao {

  /**
   * 名称
   */
  public name: string

  /**
   * 自动编号配置
   */
  public autoNmber: AutoNumber

  /**
   * Mongoose Model层
   */
  public model: mongoose.Model<mongoose.Document, {}>

  /**
   * 查询器选项
   */
  public options: QueryOptions

  /**
   *  seqModel
   */
  public seqModel: mongoose.Model<mongoose.Document, {}>

  /**
   * 初始化构造
   * @param model mongoose.Model<mongoose.Document, {}>
   * @param options QueryOptions
   */
  constructor (model: mongoose.Model<mongoose.Document, {}>, options: QueryOptions = {}) {
    this.model = model
    this.name = options.name || model.modelName
    this.options = { populate: { path: '' }, ...options }
    this.seqModel = options.seqModel || seqModel
  }

  /**
   * 创建数据文档
   * @param doc any
   * @param populate mongoose.ModelPopulateOptions
   * @returns Promise<mongoose.Document>
   */
  public create (doc: any, populate?: mongoose.ModelPopulateOptions): Promise<mongoose.Document> {
    return this.model.create(doc)
      .then( res => Bluebird.promisifyAll(res)['populateAsync'](populate || this.options.populate) )
  }

  /**
   * 创建数据文档(自动编号)
   * @param doc any
   * @param populate mongoose.ModelPopulateOptions
   * @returns Promise<mongoose.Document>
   */
  public insert (doc: any, populate?: mongoose.ModelPopulateOptions): Promise<mongoose.Document> {
    if (!this.autoNmber) return this.create(doc, populate)
    let idName: string = this.autoNmber.idName || 'id'
    let idStart: number = this.autoNmber.idStart || 1
    return this.addAndUpdateKeys(this.name, idStart)
      .then( id => this.create({ ...doc, [idName]: id }, populate) )
  }

  /**
   * 查询单条数据
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<mongoose.Document | null>
   */
  public findOne (conditions: any, options: QueryOptions = {}): Promise<mongoose.Document | null> {
    return new Promise((resolve, reject) => {
      this.model.findOne(conditions)
        .populate(options.populate || this.options.populate)
        .select(options.select)
        .exec( (err: any, res: mongoose.Document | null) => callback(resolve, reject, err, res))
    })
  }

  /**
   * 查询多条数据（列表）
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<mongoose.Document[]>
   */
  public find (conditions: any = {}, options: QueryOptions = {}): Promise<mongoose.Document[]> {
    return new Promise((resolve, reject) => {
      this.model.find(conditions)
        .populate(options.populate || this.options.populate)
        .select(options.select)
        .sort(options.sort || { _id: 1 })
        .limit(options.limit || 0)
        .skip(options.skip || 0)
        .exec( (err: any, res: mongoose.Document[]) => callback(resolve, reject, err, res))
    })
  }

  /**
   * 查询多条数据的总条数
   * @param conditions any
   * @returns Promise<mongoose.Query<number>>
   */
  public counts (conditions: any = null): Promise<mongoose.Query<number>> {
    return new Promise((resolve, reject) => {
      if (conditions) {
        this.model.countDocuments(conditions, (err: any, count: number) => callback(resolve, reject, err, count))
      }
      else {
        this.model.estimatedDocumentCount((err: any, count: number) => callback(resolve, reject, err, count))
      }
    })
  }

  /**
   * 数据分页列表
   * @param conditions any
   * @param options QueryOptions
   * @returns Promise<ListData | Maps<any>>
   */
  public list (conditions: any = {}, options: QueryOptions = {}): Promise<ListData | Maps<any>> {
    let { limit } = options
    return Promise.all([
      this.find(conditions, options),
      this.counts(conditions)
    ])
    .then( fill => zipObject(['data', 'counts', 'limit'], [...fill, limit || 0]))
  }

  /**
   * 更新单条数据
   * @param conditions any
   * @param doc any
   * @param options mongoose.ModelUpdateOptions
   * @returns Promise<mongoose.Query<any>>
   */
  public updateOne (conditions: any, doc: any, options: mongoose.ModelUpdateOptions = {}): Promise<mongoose.Query<UpdateWriteResult>> {
    return new Promise((resolve, reject) => {
      this.model.updateOne(conditions, doc, options, (err: any, raw: any) => callback(resolve, reject, err, raw))
    })
  }

  /**
   * 更新多条数据
   * @param conditions any
   * @param doc any
   * @param options mongoose.ModelUpdateOptions
   * @returns Promise<mongoose.Query<any>>
   */
  public update (conditions: any, doc: any, options: mongoose.ModelUpdateOptions = {}): Promise<mongoose.Query<UpdateWriteResult>> {
    return new Promise((resolve, reject) => {
      this.model.updateMany(conditions, doc, options, (err: any, raw: any) => callback(resolve, reject, err, raw))
    })
  }

  /**
   * 批量操作
   * @param writes: any[]
   * @returns Promise<mongodb.BulkWriteOpResultObject>
   * @description https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite
   */
  public bulkWrite = (writes: any[]): Promise<mongodb.BulkWriteOpResultObject> => this.model.bulkWrite(writes)

  /**
   * 删除数据文档
   * @param conditions any
   * @returns Promise<mongoose.Query<any>>
   */
  public remove (conditions?: any): mongoose.Query<DeleteWriteResult> {
    return <mongoose.Query<DeleteWriteResult>> this.model.deleteMany(conditions)
  }

  /**
   * 清除数据文档
   */
  public clear (): Promise<void> {
    return this.remove().then(() => this.model.collection.dropIndexes())
  }

  /**
   * ID 自动递增
   * @param name string
   * @param start number
   * @returns Promise<number>
   */
  private addAndUpdateKeys (name: string, start: number = 1): Promise<number> {
    if (!this.autoNmber) return Promise.resolve(0)
    let idStep: number = this.autoNmber.idStep || 1
    return new Promise((resolve, reject) => {
      this.seqModel.findOne({ name }, (err: any, res: mongoose.Document | null) => callback(resolve, reject, err, res))
    })
    .then( (doc: seqDocument) => {
      if (doc) {
        doc.seq = doc.seq < start ? start : doc.seq + idStep
        doc.save()
        return doc
      }
      else {
        return this.seqModel.create({ name, seq: start })
      }
    })
    .then( (ret: seqDocument) => ret.seq || 1)
  }

}

/**
 * 设置自动编号
 * @param setting AutoNumber
 */
export function autoNumber (setting: AutoNumber): any {
  return function (target: any): void {
    target.prototype.autoNmber = {
      idName: 'id',
      idStart: 1,
      idStep: 1,
      ...setting
    }
  }
}

/**
 * Promise 回调
 * @param resolve (thenableOrResult?: any) => void
 * @param reject (error?: any) => void
 * @param err Error
 * @param doc any
 */
export const callback = (resolve: (thenableOrResult?: unknown) => void, reject: (error?: any) => void, err: Error, doc: any = null) => {
  if (err) {
    reject(err)
  }
  else {
    resolve(doc)
  }
}
