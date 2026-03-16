import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)
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
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user ? blog.user.id : null }
    addLike(blog.id, updatedBlog)
  }
  const handleRemove = () => {
    deleteBlog(blog.id, blog)
  }
  const showRemoveButton = blog.user && currentUser && (blog.user.username === currentUser.username || blog.user.id === currentUser.id || blog.user === currentUser.id)
  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className='blog-details'>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : 'Unknown User'}</p>
          {showRemoveButton && (
            <button
              style={{ backgroundColor: '#008CBA', color: 'white', borderRadius: '5px' }}
              onClick={handleRemove}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog