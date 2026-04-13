import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  if (!blog.author) {
    return (
      <div style={blogStyle} className="blog-list-item">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </div>
    )
  }
  return (
    <div style={blogStyle} className="blog-list-item">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} - {blog.author}
      </Link>
    </div>
  )
}

export default Blog
