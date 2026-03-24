import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  // Lấy phần tử đầu tiên của mảng value truyền từ Provider (chính là biến notification)
  const [notification] = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  // Nếu không có thông báo thì tàng hình
  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification