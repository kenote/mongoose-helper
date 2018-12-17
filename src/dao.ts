import Promise from 'bluebird'
import * as mongoose from 'mongoose'
import zipObject from 'lodash/zipObject'

export interface QueryOptions {
  name?: string;
  populate?: mongoose.ModelPopulateOptions;
  select?: any;
  sort?: any;
  limit?: number;
  skip?: number;
  seqModel?: mongoose.Model<mongoose.Document, {}>;
}

interface daoSetting {
  idName?: string;
  idStart?: number;
  idStep?: number;
}

interface seqDocument extends mongoose.Document {
  name: string;
  seq: number;
}

export class MongooseDao {

  public name: string;
  public model: mongoose.Model<mongoose.Document, {}>;
  public populate: mongoose.ModelPopulateOptions = { path: '' };

  private setting: daoSetting;
  private seqModel: mongoose.Model<mongoose.Document, {}>;

  constructor (Model: mongoose.Model<mongoose.Document, {}>, options: QueryOptions = {}) {
    this.model = Model;
    this.name = options.name || Model.modelName;
    if (options.populate) {
      this.populate = options.populate;
    }
    if (options.seqModel) {
      this.seqModel = options.seqModel
    }
  }

  public start = (): Promise<{}> => new Promise((resolve) => resolve(0))

  public create (doc: any, populate?: mongoose.ModelPopulateOptions) {
    return this.model.create(doc)
      .then( (res: mongoose.Document) => Promise.promisifyAll(res)['populateAsync'](populate || this.populate) )
  }

  public insert (doc: any, populate?: mongoose.ModelPopulateOptions): Promise<mongoose.Document> {
    let { idName } = this.setting
    let idStart = this.setting.idStart || 1
    if (!this.seqModel) return new Promise((resolve) => resolve(undefined))
    return this.addAndUpdateKeys(this.name, idStart)
      .then( (id: number) => this.create({ ...doc, [idName || 'id']: id }, populate))
  }

  private addAndUpdateKeys (name: string, start: number = 1): Promise<any> {
    let idStep = this.setting.idStep || 1
    return new Promise((resolve, reject) => {
      this.seqModel.findOne({ name }, (err: any, res: mongoose.Document | null) => callback(resolve, reject, err, res))
    })
    .then( (doc: seqDocument) => {
      if (doc) {
        doc.seq = doc.seq < start ? start : doc.seq + idStep
        doc.save()
        return doc
      }
      else {
        return this.seqModel.create({ name, seq: start })
      }
    })
    .then( ret => (<seqDocument> ret).seq || 1)
  }

  public remove (conditions: any): Promise<mongoose.Query<any>> {
    return new Promise((resolve, reject) => {
      this.model.deleteMany(conditions, (err: any) => callback(resolve, reject, err))
    })
  }

  public findOne (conditions: any, options: QueryOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findOne(conditions)
        .populate(options.populate || this.populate)
        .select(options.select)
        .exec( (err: any, res: mongoose.Document | null) => callback(resolve, reject, err, res))
    })
  }

  public find (conditions: any = {}, options: QueryOptions = {}): Promise<mongoose.DocumentQuery<mongoose.Document[], mongoose.Document, {}>> {
    return new Promise((resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void) => {
      this.model.find(conditions)
        .populate(options.populate || this.populate)
        .select(options.select)
        .sort(options.sort || { _id: 1 })
        .limit(options.limit || 0)
        .skip(options.skip || 0)
        .exec( (err: any, res: mongoose.Document[]) => callback(resolve, reject, err, res))
    })
  }

  public counts (conditions: any = null): Promise<mongoose.Query<number>> {
    return new Promise((resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void) => {
      this.model.countDocuments(conditions, (err: any, count: number) => callback(resolve, reject, err, count))
    })
  }

  public clear (): Promise<void> {
    return this.remove({}).then(() => this.model.collection.dropIndexes())
  }

  public updateOne (conditions: any, doc: any): Promise<mongoose.Query<any>> {
    return new Promise((resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void) => {
      this.model.updateOne(conditions, doc, (err: any, raw: any) => callback(resolve, reject, err, raw))
    })
  }

  public update (conditions: any, doc: any): Promise<mongoose.Query<any>> {
    return new Promise((resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void) => {
      this.model.update(conditions, doc, (err: any, raw: any) => callback(resolve, reject, err, raw))
    })
  }

  public list (conditions: any = {}, options: QueryOptions = {}) {
    let { limit } = options
    return Promise.all([
      this.find(conditions, options),
      this.counts(conditions)
    ])
    .then( fill => zipObject(['data', 'counts', 'limit'], [...fill, limit || 0]))
  }

}

export function MongooseDaoSetting (setting: daoSetting) {
  return function (target: any): void {
    target.prototype.setting = {
      idName: 'id',
      idStart: 1,
      idStep: 1,
      ...setting
    }
  }
}

const callback = (resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void, err: Error, doc: any = null) => {
  if (err) {
    reject(err)
  }
  else {
    resolve(doc)
  }
}