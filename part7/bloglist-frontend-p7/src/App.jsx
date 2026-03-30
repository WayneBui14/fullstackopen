import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const blogs = useSelector(state => state.blogs)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotification(`welcome ${user.name}`, 'success'))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error'))
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        'success'
      ))
    } catch (exception) {
      dispatch(setNotification('Failed to create blog', 'error'))
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
    } catch (exception) {
      dispatch(setNotification('Failed to update blog', 'error'))
    }
  }

  const deleteBlog = async (id, blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)
    ) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
        dispatch(setNotification(
          `Blog ${blogObject.title} by ${blogObject.author} removed`,
          'success'
        ))
      } catch (exception) {
        dispatch(setNotification('Failed to remove blog', 'error'))
      }
    }
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  return (
    <div>
      <Notification />
      {user === null ? (
        <div>
          <h2>login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>
                username
                <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                password
                <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </label>
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                addLike={addLike}
                deleteBlog={deleteBlog}
                currentUser={user}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
