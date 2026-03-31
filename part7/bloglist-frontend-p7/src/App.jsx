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
import { setUser, loginUser, logoutUser } from './reducers/userReducer'
import Users from './components/Users'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { initializeUsers } from './reducers/usersReducer'
import User from './components/User'
import BlogDetails from './components/BlogDetails'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
          'success'
        )
      )
    } catch (exception) {
      dispatch(setNotification('Failed to create blog', 'error'))
    }
  }

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(parsedUser))
      blogService.setToken(parsedUser.token)
    }
  }, [])
  const menuStyle = {
    backgroundColor: 'lightgray',
    padding: 10,
    marginBottom: 20
  }

  const linkStyle = {
    paddingRight: 10,
    textDecoration: 'none',
    fontWeight: 'bold'
  }
  return (
    <div>
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
        <Router>
          <div>
            <div style={menuStyle}>
              <Link to="/" style={linkStyle}>
                blogs
              </Link>
              <Link to="/users" style={linkStyle}>
                users
              </Link>
              <span>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
              </span>
            </div>
            <h2>blogs</h2>
            <Notification />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>
                    {[...blogs]
                      .sort((a, b) => b.likes - a.likes)
                      .map((blog) => (
                        <Blog key={blog.id} blog={blog} currentUser={user} />
                      ))}
                  </div>
                }
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
            </Routes>
          </div>
        </Router>
      )}
    </div>
  )
}

export default App
