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
    const { savedTestUser, testToken } = await helper.testToken()
    const newBlog = {
      title: 'Testing is straightforward!',
      author: 'Marja Meikalainen',
      url: 'www.marjantestiblogi.fi',
      likes: 3,
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

    const titles = blogsAfter.map(r => r.title)
    assert(titles.includes('Testing is straightforward!'))
  })
  test('adds 0 likes if the field is not given a value', async () => {
    const { savedTestUser, testToken } = await helper.testToken()
    const newBlog = {
      title: 'Testing needs to be done!',
      author: 'Minja Meikalainen',
      url: 'www.minjantestiblogi.fi',
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

    const likes = blogsAfter.map(r => r.likes)
    assert(likes.includes(0))
  })
  test('returns statuscode 400 if title is missing', async () => {
    const { savedTestUser, testToken } = await helper.testToken()
    const newBlog = {
      author: 'Maikku Meikalainen',
      url: 'www.maikuntestiblogi.fi',
      likes: 4,
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(400)
  })
  test('returns statuscode 400 if url is missing', async () => {
    const { savedTestUser, testToken } = await helper.testToken()
    const newBlog = {
      title: 'Testing can be exhausting',
      author: 'Minttu Meikalainen',
      likes: 5,
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(400)
  })
  test('returns statuscode 401 if token is missing', async () => {
    const { savedTestUser } = await helper.testToken()
    const newBlog = {
      title: 'Tests do not write themselves',
      author: 'Some Guy',
      url: 'www.sometestguy.com',
      likes: 3,
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })
})

describe('blog DELETE api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('can delete a blog', async () => {
    const { testToken, savedTestUser } = await helper.testToken()
    const blogsBefore = await helper.blogsInDb()

    const newBlog = {
      title: 'Tests do not write themselves',
      author: 'Some Guy',
      url: 'www.sometestguy.com',
      likes: 3,
      user: savedTestUser._id.toString()
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = await Blog.findOne({ title: 'Tests do not write themselves' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, blogsBefore.length)
    const titles = blogsAfter.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('blog PUT api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('can update a blog', async () => {
    const blogsBefore = await helper.blogsInDb()

    const chosenId = 0
    const chosenBlog = blogsBefore[chosenId]
    chosenBlog.likes += 1

    await api
      .put(`/api/blogs/${chosenBlog.id}`)
      .send(chosenBlog)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()

    const updatedBlog = blogsAfter.find(r => r.id === chosenBlog.id)
    assert.strictEqual(updatedBlog.likes, chosenBlog.likes)
    assert.strictEqual(updatedBlog.likes, helper.initialBlogs[chosenId].likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})