# mongoose-helper

Mongoose's Helper.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Gratipay][licensed-image]][licensed-url]

## Premise

```bash
$ npm install mongoose
$ npm install --save-dev @types/mongoose @types/bluebird @types/lodash
# Or
$ yarn add mongoose
$ yarn add -D @types/mongoose @types/bluebird @types/lodash
```

## Installation

```bash
$ npm install kenote-mongoose-helper
#
$ yarn add kenote-mongoose-helper
```

## Usages

`models/index.ts`

```ts
import * as mongoose from 'mongoose'
import { Connector, Connect, MountModels } from 'kenote-mongoose-helper'
import userModel from './user'

@Connect({
  uris: 'mongodb://localhost:27017/mongodb_test'
})
@MountModels({ userModel })
class MongoDB extends Connector {}

const DB: Connector = new MongoDB()
DB.connect()

export default DB.__Models
```

`models/user.ts`

```ts
import { Schema, model } from 'mongoose'

export default model('user', new Schema({
  id: {
    type: Number,
    default: 0,
    index: { unique: true }
  },
  username: {
    type: String,
    required: true
  }
}))
```

`proxy/user.ts`

```ts
import * as mongoose from 'mongoose' 
import { MongooseDao, autoNumber, QueryOptions } from 'kenote-mongoose-helper'
import __Model from '../models'

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
```

`**/user.ts`

```ts
import * as mongoose from 'mongoose'
import userProxy from '../proxy/user'

async function createUser (doc: any): mongoose.Document | null {
  try {
    let user: mongoose.Document | null = userProxy.Dao.create(doc)
    return user
  } catch (error) {
    console.erroe(error)
  }
}
```

## License

this repo is released under the [MIT License](https://github.com/kenote/mongoose-helper/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/kenote-mongoose-helper.svg
[npm-url]: https://www.npmjs.com/package/kenote-mongoose-helper
[downloads-image]: https://img.shields.io/npm/dm/kenote-mongoose-helper.svg
[downloads-url]: https://www.npmjs.com/package/kenote-mongoose-helper
[travis-image]: https://travis-ci.com/kenote/config-mongoose.svg?branch=master
[travis-url]: https://travis-ci.com/kenote/mongoose-helper
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/kenote/mongoose-helper/blob/master/LICENSE