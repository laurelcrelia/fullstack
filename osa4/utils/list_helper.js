const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
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

module.exports = {
  dummy, totalLikes, favoriteBlog
}