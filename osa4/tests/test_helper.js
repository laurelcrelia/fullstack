const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    _id: '668be3a8a34d1b0cbaaa5831',
    title: 'Testing is fun!',
    author: 'Matti Meikalainen',
    url: 'www.matintestiblogi.fi',
    likes: 1,
    __v: 0
  },
  {
    _id: '668be3a8a34d1b0cbaaa5832',
    title: 'Testing is easy!',
    author: 'Maija Meikalainen',
    url: 'www.maijantestiblogi.fi',
    likes: 2,
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const testToken = async () => {
  await User.deleteMany({})
  const testUser = new User({ username: 't.testaaja', name: 'Tauno Testaaja', password: 'password123' })
  const savedTestUser = await testUser.save()
  const testToken = jwt.sign({ id: savedTestUser._id }, process.env.SECRET)
  return { savedTestUser, testToken }
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  testToken
}