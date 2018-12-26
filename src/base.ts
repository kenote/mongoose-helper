import * as Promise from 'bluebird'
import * as mongoose from 'mongoose'
import { callback } from './dao'

export interface mongoSetting {
  uris: string;
  options?: mongoose.ConnectionOptions;
}

interface models {
  [propName: string]: mongoose.Model<mongoose.Document, {}>;
}

export class MongoDB {
  public __setting: mongoSetting;
  public __Models: models;
  private __defaultOptions: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true
  }
  
  public connect (): void {
    mongoose.connect(this.__setting.uris, this.__setting.options || this.__defaultOptions, err => {
      if (err) {
        console.error(`connect to ${this.__setting.uris} error: ${err.message}`)
        process.exit(1)
      }
    })
  }
}

export function MongoSetting (setting: mongoSetting) {
  return function (target: any) {
    target.prototype.__setting = setting
  }
}

export function ModelMount (models: models) {
  return function (target: any) {
    target.prototype.__Models = {
      seqModel,
      ...models
    }
  }
}

const seqModel: mongoose.Model<mongoose.Document, {}> = mongoose.model('seq', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
}))