import { Connect, Connector, Mount } from '../../src'
import userModel from './user'

@Connect({
  uris: 'mongodb://localhost:27017/mongodb_test'
})
@Mount({ userModel })
class MongoDB extends Connector {}

const DB: Connector = new MongoDB()
DB.connect()

export default DB.__Models
