const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')

describe('blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
  })

  test('returned blogs have an id field', async () => {
    const response = await api.get('/api/blogs')
    const allHaveIdField = response.body.map(e => e.id !== undefined)
    const amountOfIdFields = blogsInDb.length
    for (let i = 0; i < amountOfIdFields; i++) {
      assert.strictEqual(allHaveIdField[i], true)
    }
  })
})

after(async () => {
  await mongoose.connection.close()
})