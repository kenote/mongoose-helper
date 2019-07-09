import { ModelPopulateOptions, Model, Document, Query } from 'mongoose'
import { seqModel, Maps, InsertWriteResult } from './';

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