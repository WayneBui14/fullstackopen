import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null, // null nghĩa là không có thông báo nào
  reducers: {
    showNotification(state, action) {
      return action.payload // payload sẽ có dạng { message: '...', type: 'success' | 'error' }
    },
    clearNotification() {
      return null
    }
  }
})

export const { showNotification, clearNotification } = notificationSlice.actions

// Tạo Thunk Action để tự động tắt thông báo sau vài giây
export const setNotification = (message, type = 'success', timeInSeconds = 5) => {
  return async dispatch => {
    dispatch(showNotification({ message, type }))
    
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer