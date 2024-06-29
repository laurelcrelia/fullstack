const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  else {
    let favorite = blogs[0]
    blogs.forEach((blog) => {
      if (blog.likes > favorite.likes) {
        favorite = blog
      }
    })
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  else {
    let mostBlogs = (
      lodash(blogs)
        .countBy('author')
        .entries()
        .maxBy('1'))
    return {
      author: mostBlogs[0],
      blogs: mostBlogs[1]
    }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  else {
    let mostLikes = (
      lodash(blogs)
        .groupBy('author')
        .map((blogs, author) => ({ author, likes: lodash.sumBy(blogs, 'likes') }))
        .maxBy('likes')
    )
    return mostLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}