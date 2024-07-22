import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    returnedBlog.user = { name: user.name }
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} added`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 4000)
  }

  const addLike = async (blogObject) => {
    const likedBlog = { ...blogObject, likes: blogObject.likes + 1 }
    await blogService.like(likedBlog)
    setBlogs(blogs.map((b) => (b.id === likedBlog.id ? likedBlog : b)))
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      await blogService.remove(blogObject)
      setBlogs(blogs.filter((b) => b.id !== blogObject.id))
      setSuccessMessage(
        `blog named ${blogObject.title} was successfully deleted`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 4000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} type='error' />
          {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} type='success' />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <div>
            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              user={user.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
