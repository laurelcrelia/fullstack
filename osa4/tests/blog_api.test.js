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
  test('returns statuscode 400 if title is missing', async () => {
    const newBlog = {
      author: 'Maikku Meikalainen',
      url: 'www.maikuntestiblogi.fi',
      likes: 4
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  test('returns statuscode 400 if url is missing', async () => {
    const newBlog = {
      title: 'Testing can be exhausting',
      author: 'Minttu Meikalainen',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('blog DELETE api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('can delete a blog', async () => {
    const firstResponse = await api.get('/api/blogs')
    const firstResponseIds = firstResponse.body.map(r => r.id)
    const blogToDelete = firstResponseIds[0]

    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .expect(204)

    const secondResponse = await api.get('/api/blogs')
    const secondResponseIds = secondResponse.body.map(r => r.id)
    assert.strictEqual(secondResponse.body.length, firstResponse.body.length - 1)
    assert(!secondResponseIds.includes(blogToDelete))
  })
})

after(async () => {
  await mongoose.connection.close()
})