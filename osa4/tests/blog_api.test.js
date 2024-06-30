const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')

describe('blog GET api', () => {
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

  test('returns blogs that have an id field', async () => {
    const response = await api.get('/api/blogs')
    const allHaveIdField = response.body.map(e => e.id !== undefined)
    const amountOfIdFields = blogsInDb.length
    for (let i = 0; i < amountOfIdFields; i++) {
      assert.strictEqual(allHaveIdField[i], true)
    }
  })
})

describe('blog POST api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('can add a valid blog', async () => {
    const newBlog = {
      title: 'Testing is straightforward!',
      author: 'Marja Meikalainen',
      url: 'www.marjantestiblogi.fi',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    const titles = response.body.map(r => r.title)
    assert(titles.includes('Testing is straightforward!'))
  })
  test('adds 0 likes if the field is not given a value', async () => {
    const newBlog = {
      title: 'Testing needs to be done!',
      author: 'Minja Meikalainen',
      url: 'www.minjantestiblogi.fi',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    const likes = response.body.map(r => r.likes)
    assert(likes.includes(0))
  })
})

after(async () => {
  await mongoose.connection.close()
})