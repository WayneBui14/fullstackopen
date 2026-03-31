import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { useState } from 'react'

const BlogDetails = () => {
  const [comment, setComment] = useState('')
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

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, comment))
    setComment('')
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
      <h3>comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {/* Dùng (blog.comments || []) để đề phòng trường hợp blog cũ chưa có mảng comments gây lỗi */}
        {(blog.comments || []).map((comment, index) => (
          // Vì comment ẩn danh không có ID riêng, ta tạm dùng index làm key
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetails
