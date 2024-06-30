const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs: initialBlogs, nonExistingId, blogsInDb
}