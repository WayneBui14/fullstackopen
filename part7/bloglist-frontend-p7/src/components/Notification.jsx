import { useSelector } from 'react-redux'

const Notification = () => {
  // Lấy state từ Redux
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  // Tùy theo cách bạn viết CSS ở Part 5, có thể dùng class 'error' hoặc 'success'
  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification