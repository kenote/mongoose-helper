import * as mongoose from 'mongoose'
import { seqModel } from './'
import { ConnectorSetting, Maps } from '../types'

/**
 * Mongoose 连接器
 */
export class Connector {

  /**
   * 连接配置
   */
  public __setting: ConnectorSetting

  /**
   * 数据模型集
   */
  public __Models: Maps<mongoose.Model<mongoose.Document, {}>>

  /**
   * 连接数据库
   */
  public connect (): void {
    if (!this.__setting) {
      console.warn('Missing `MongoDB` connection configuration.')
      return
    }
    let { uris, options } = this.__setting
    if (Array.isArray(uris)) uris = uris.join(',')
    mongoose.connect(uris, options || { useNewUrlParser: true, useCreateIndex: true }, err => {
      if (err) {
        console.error(`connect to ${uris} error: ${err.message}`)
        process.exit(1)
      }
    })
  }

}

/**
 * Mongoose 连接器配置
 * @param setting ConnectorSetting
 */
export function Connect (setting: ConnectorSetting): any {
  return function (target: any): void {
    target.prototype.__setting = setting
  }
}

/**
 * 挂载 Models
 * @param models Maps<mongoose.Model<mongoose.Document, {}>>
 */
export function Mount (models: Maps<mongoose.Model<mongoose.Document, {}>>): any {
  return function (target: any): void {
    target.prototype.__Models = { seqModel, ...models }
  }
}
