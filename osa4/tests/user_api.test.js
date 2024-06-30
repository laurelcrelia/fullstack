const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

describe('user POST api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  test('adding a valid user', async () => {
    const newUser = {
      'username': 'sarppa',
      'name': 'Sara',
      'password': 'omena'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length + 1)

    const names = response.body.map(r => r.name)
    assert(names.includes('Sara'))
  })

  test('adding user with too short name', async () => {
    const newUser = {
      'username': 'ma',
      'name': 'Martta',
      'password': 'mansikka'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username and password must have at least 3 characters')
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('adding user with too short password', async () => {
    const newUser = {
      'username': 'martta01',
      'name': 'Martta',
      'password': 'ma'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username and password must have at least 3 characters')
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('adding user without password', async () => {
    const newUser = {
      'username': 'inkku',
      'name': 'Inka',
      'password': undefined
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username or password missing')
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('adding user without username', async () => {
    const newUser = {
      'username': undefined,
      'name': 'Perttu',
      'password': 'peruna'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username or password missing')
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('adding user with existing username', async () => {
    const newUser = {
      'username': 'mmeikalainen',
      'name': 'Maija',
      'password': 'banaani'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username is already taken')
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})