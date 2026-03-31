import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  // Lấy id từ thanh địa chỉ URL
  const { id } = useParams()

  // Tìm đúng user có id trùng khớp trong Redux Store
  const user = useSelector((state) => state.userList.find((u) => u.id === id))

  // LƯU Ý QUAN TRỌNG:
  // Lần đầu render, Redux có thể chưa kịp gọi API lấy list user về, biến user sẽ bị undefined.
  // Cần bắt lỗi này để tránh trắng trang (Crash app).
  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
