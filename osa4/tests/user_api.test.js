const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const User = require('../models/user')

describe('user POST api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('adding a valid user', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const names = usersAtEnd.map(r => r.name)
    assert(names.includes('Sara'))
  })

  test('adding user with too short name', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'username and password must have at least 3 characters')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding user with too short password', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'username and password must have at least 3 characters')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding user without password', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'username or password missing')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding user without username', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'username or password missing')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('adding user with existing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      'username': 'root',
      'name': 'Maija',
      'password': 'banaani'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'username is already taken')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})