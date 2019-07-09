import { KenoteConfigBase } from './'

/**
 * Mongoose 连接配置
 */
export interface KenoteMongooseConnectorSetting extends KenoteConfigBase {

  /**
   * MongoDB 链接
   */
  uris                : string | string[]

}
