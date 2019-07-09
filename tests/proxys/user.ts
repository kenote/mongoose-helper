
import * as mongoose from 'mongoose'
import { MongooseDao, autoNumber } from '../../src'
import { QueryOptions } from '../../types'
import __Models from '../models'

const Model: mongoose.Model<mongoose.Document, {}> = __Models.userModel
const options: QueryOptions = {
  name: 'user',
  populate: { path: '' },
  seqModel: __Models.seqModel
}

@autoNumber({
  idName: 'id'
})
class UserDao extends MongooseDao {}

class UserProxy {

  public Dao: MongooseDao = new UserDao(Model, options)
}

export default new UserProxy()
