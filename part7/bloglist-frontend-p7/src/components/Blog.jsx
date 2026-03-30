import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }
  const handleRemove = () => {
    dispatch(deleteBlog(blog.id))
  }
  const showRemoveButton =
    blog.user &&
    currentUser &&
    (blog.user.username === currentUser.username ||
      blog.user.id === currentUser.id ||
      blog.user === currentUser.id)
  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : 'Unknown User'}</p>
          {showRemoveButton && (
            <button
              style={{
                backgroundColor: '#008CBA',
                color: 'white',
                borderRadius: '5px'
              }}
              onClick={handleRemove}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
