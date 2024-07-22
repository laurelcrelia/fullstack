import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [fullView, setFullView] = useState(false)

  const toggleFullView = () => {
    setFullView(!fullView)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!fullView) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleFullView}>view</button>
      </div>
    )
  }

  return (
  <div style={blogStyle}>
    {blog.title} <button onClick={toggleFullView}>hide</button>
    <div>{blog.url}</div>
    <div>likes {blog.likes}<button onClick={() => addLike(blog)}>like</button></div>
    <div>{blog.author}</div>
    {user === blog.user.name && (
    <button onClick={() => removeBlog(blog)}>remove</button>
    )}
  </div>  
  )
}

export default Blog