# mongoose-helper
Mongoose's Helper.

## Installation

```bash
$ yarn add kenote-mongoose-helper
```

## Usages

`models/index.ts`

```ts
import * as mongoose from 'mongoose'
import { MongoDB as mongoDB, MongoSetting, ModelMount } from 'kenote-mongoose-helper'
import config from '../config'
import userSchema from './user'

@MongoSetting({
  urls: 'mongodb://localhost:27017/db_connection',
  options: {
    useNewUrlParser: true,
    useCreateIndex: true
  }
})
@ModelMount({
  userModel: mongoose.model('user', userSchema)
})
class MongoDB extends mongoDB {

}

const DB: MongoDB = new MongoDB()

DB.connect()

export default DB.__Models
```

`proxy/user.ts`

```ts
import Promise from 'bluebird'
import * as mongoose from 'mongoose' 
import __Model from '../models'
import { MongooseDao as mongooseDao, MongooseDaoSetting, QueryOptions } from 'kenote-mongoose-helper'

(<any>mongoose).Promise = Promise
const Model: mongoose.Model<mongoose.Document, {}> = __Model['userModel']
const options: QueryOptions = {
  name: 'user',
  populate: { path: '' },
  seqModel: __Model['seqModel']
}

@MongooseDaoSetting({
  idName: 'userid'
})
class MongooseDao extends mongooseDao {}

export interface createDocument {
  username: string;
}

export interface responseDocument extends mongoose.Document {
  id: number;
  username: string;
}

class groupProxy {

  public Dao: MongooseDao;

  constructor () {
    this.Dao = new MongooseDao(Model, options)
  }

  public create (doc: createDocument): Promise<responseDocument | {}> {
    let start = this.Dao.start

    return start()
      .then( (counts: number) => {
        if (counts > 0) {

        }
        return this.Dao.insert(doc)
      })
  }
}

export default new userProxy()
```

`**/user.ts`

```ts
import userProxy from '../proxy/user'

userProxy.create({ username: 'test' })
.then( user => {
  console.log(user)
  /*
  {
    userid: 1,
    username: 'test',
    _id: 5c1762db4539f6260d548f13,
    __v: 0
  }
  */
})
```

## License

this repo is released under the [MIT License](https://github.com/kenote/mongoose-helper/blob/master/LICENSE).