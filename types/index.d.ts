import { KenoteMongooseConnectorSetting } from './connector'
import { 
  KenoteMongooseQueryOptions, 
  KenoteMongooseAutoNumber, 
  KenoteMongooseSeqDocument, 
  KenoteMongooseListData,
  KenoteMongooseUpdateWriteResult,
  KenoteMongooseInsertWriteResult,
  KenoteMongooseDeleteWriteResult,
} from './dao'
import { Connector, Connect, MountModels, seqModel, MongooseDao, autoNumber, callback } from '../src'

export {
  Connector,
  Connect,
  MountModels,
  seqModel,
  MongooseDao,
  autoNumber,
  callback,
  KenoteConfigBase,
  KenoteConfigMaps as Maps,
  KenoteMongooseConnectorSetting as ConnectorSetting,
  KenoteMongooseQueryOptions as QueryOptions,
  KenoteMongooseAutoNumber as AutoNumber,
  KenoteMongooseSeqDocument as seqDocument,
  KenoteMongooseListData as ListData,
  KenoteMongooseUpdateWriteResult as UpdateWriteResult,
  KenoteMongooseInsertWriteResult as InsertWriteResult,
  KenoteMongooseDeleteWriteResult as DeleteWriteResult
}

interface KenoteConfigMaps<T> extends Record<string, T> {}

interface KenoteConfigBase {

  /**
   * 自定义选项
   */
  options            ?: KenoteConfigMaps<any>

}