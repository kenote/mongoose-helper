import { 
  KenoteMongooseConnectorSetting, 
  KenoteMongooseConnect, 
  KenoteMongooseConnector, 
  KenoteMongooseMountModels 
} from './connector'
import { 
  KenoteMongooseQueryOptions, 
  KenoteMongooseAutoNumber, 
  KenoteMongooseSeqDocument, 
  KenoteMongooseListData,
  KenoteMongooseUpdateWriteResult,
  KenoteMongooseInsertWriteResult,
  KenoteMongooseDeleteWriteResult,
  KenoteMongooseMongooseDao,
  KenoteMongooseautoNumber,
  KenoteMongooseCallback
} from './dao'
import { KenoteMongooseSeqModel } from './model'

export {
  KenoteMongooseConnector as Connector,
  KenoteMongooseConnect as Connect,
  KenoteMongooseMountModels as MountModels,
  KenoteMongooseSeqModel as seqModel,
  KenoteMongooseMongooseDao as MongooseDao,
  KenoteMongooseautoNumber as autoNumber,
  KenoteMongooseCallback as callback,
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