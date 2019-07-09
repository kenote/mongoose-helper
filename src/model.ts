import * as mongoose from 'mongoose'

/**
 * ID 自动编号 Model
 */
export const seqModel: mongoose.Model<mongoose.Document, {}> = mongoose.model('seq', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
}))
