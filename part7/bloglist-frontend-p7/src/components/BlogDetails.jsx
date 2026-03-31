import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const BlogDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Tìm blog trong Redux dựa vào id từ URL
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  // Lấy user đang đăng nhập để check quyền xóa
  const currentUser = useSelector((state) => state.user)

  // Đề phòng trường hợp F5, Redux chưa kịp tải xong data
  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      // Xóa xong thì điều hướng về trang chủ
      navigate('/')
    }
  }

  const isCreator =
    blog.user && currentUser && blog.user.username === currentUser.username

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}
      </h2>

      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>

      <div>
        {blog.likes} likes
        <button onClick={handleLike} style={{ marginLeft: 5 }}>
          like
        </button>
      </div>

      <div>added by {blog.user ? blog.user.name : 'Unknown User'}</div>

      {isCreator && (
        <button
          onClick={handleDelete}
          style={{ marginTop: 10, cursor: 'pointer' }}
        >
          remove
        </button>
      )}
    </div>
  )
}

export default BlogDetails
