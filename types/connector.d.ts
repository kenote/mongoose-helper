import * as mongoose from 'mongoose'
import { KenoteConfigBase, Maps, ConnectorSetting } from './'

/**
 * Mongoose 连接器
 */
export declare class KenoteMongooseConnector {

  /**
   * 连接配置
   */
  private __setting?: ConnectorSetting

  /**
   * 数据模型集
   */
  public __Models?: Maps<mongoose.Model<mongoose.Document, {}>>

  /**
   * 连接数据库
   */
  public connect (): void

}

/**
 * Mongoose 连接器配置
 * @param setting ConnectorSetting
 */
export declare function KenoteMongooseConnect (setting: ConnectorSetting): any

/**
 * 挂载 Models
 * @param models Maps<mongoose.Model<mongoose.Document, {}>>
 */
export declare function KenoteMongooseMountModels (models: Maps<mongoose.Model<mongoose.Document, {}>>): any

/**
 * Mongoose 连接配置
 */
export interface KenoteMongooseConnectorSetting extends KenoteConfigBase {

  /**
   * MongoDB 链接
   */
  uris                : string | string[]

}
