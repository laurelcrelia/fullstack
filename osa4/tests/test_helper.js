const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'Testing is fun!',
    'author': 'Matti Meikalainen',
    'url': 'www.matintestiblogi.fi',
    'likes': 1
  },
  {
    'title': 'Testing is easy!',
    'author': 'Maija Meikalainen',
    'url': 'www.maijantestiblogi.fi',
    'likes': 2
  }
]

const initialUsers = [
  {
    'username': 'mmeikalainen',
    'name': 'Markku',
    'password': 'porkkana'
  },
  {
    'username': 'ameikalainen',
    'name': 'Auli',
    'password': 'kaali'
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

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
}