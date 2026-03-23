import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        // 1. ĐỔI TÊN HÀM NÀY ĐỂ TRÁNH TRÙNG LẶP VỚI THUNK
        showNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return null
        }
    }
})

// Export các action nội bộ này ra
export const { showNotification, clearNotification } = notificationSlice.actions

// 2. TẠO THUNK ACTION setNotification NHƯ YÊU CẦU
export const setNotification = (message, timeInSeconds) => {
    return async dispatch => {
        // Bắn action hiện thông báo
        dispatch(showNotification(message))

        // Hẹn giờ tắt (nhân với 1000 để đổi từ giây sang mili-giây)
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeInSeconds * 1000)
    }
}

export default notificationSlice.reducer