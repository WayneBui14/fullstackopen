import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog-list-item">
      {/* Bọc tiêu đề trong Link trỏ đến /blogs/id */}
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default Blog
