import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null, // Đổi thành null để ban đầu không có thông báo
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        // Hàm này không cần action.payload, chỉ đơn giản là trả state về null
        clearNotification(state, action) {
            return null
        }
    }
})

// Export thêm clearNotification
export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer