import { createContext, useReducer } from 'react'

// 1. Khởi tạo Reducer để quản lý State của thông báo
const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW':
            return action.payload // Chứa nội dung text
        case 'HIDE':
            return null
        default:
            return state
    }
}

// 2. Tạo Context
const NotificationContext = createContext()

// 3. Tạo một Component Provider để bọc ứng dụng
export const NotificationContextProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, null)

    return (
        // Truyền cả state (notification) và hàm dispatch xuống dưới dạng 1 mảng
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext