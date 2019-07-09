import * as mongoose from 'mongoose'
import * as mongodb from 'mongodb'
import userProxy from './proxys/user'
import { ListData, Maps, UpdateWriteResult, DeleteWriteResult } from '../types'

describe('\nMongoDB Connect\n', () => {

  afterAll(async () => {
    await userProxy.Dao.clear()
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  test('Create User', async () => {
    let user: mongoose.Document | null = await userProxy.Dao.insert({ username: 'test' })
    expect(user && user['username']).toBe('test')
  })

  test('findOne User', async () => {
    let user: mongoose.Document | null = await userProxy.Dao.findOne({ username: 'test' })
    expect(user && user['username']).toBe('test')
  })

  test('find All Users', async () => {
    let users: mongoose.Document[] = await userProxy.Dao.find()
    expect(users.length).toBe(1)
  })

  test('find Users for conditions', async () => {
    let users: mongoose.Document[] = await userProxy.Dao.find({ username: 'test' })
    expect(users.length).toBe(1)
  })

  test('counts of find All Users', async () => {
    let counts: number = await userProxy.Dao.counts()
    expect(counts).toBe(1)
  })

  test('counts of find Users for conditions', async () => {
    let counts: number = await userProxy.Dao.counts({ username: 'test' })
    expect(counts).toBe(1)
  })

  test('list of All Users', async () => {
    let users: ListData | Maps<any> = await userProxy.Dao.list()
    expect(users.counts).toBe(1)
  })

  test('updateOne of User', async () => {
    let result: UpdateWriteResult = await userProxy.Dao.updateOne({ username: 'test' }, { username: 'update' })
    expect(result.ok).toBe(1)
  })

  test('update of Users', async () => {
    let result: UpdateWriteResult = await userProxy.Dao.update({ username: 'update' }, { username: 'test' })
    expect(result.ok).toBe(1)
  })

  test('remove of Users', async () => {
    let result: DeleteWriteResult = await userProxy.Dao.remove({ username: 'test' })
    expect(result.deletedCount).toBe(1)
  })

})

