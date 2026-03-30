import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null, // Ban đầu chưa ai đăng nhập
  reducers: {
    setUser(state, action) {
      return action.payload // Lưu nguyên object user (chứa token, name, username)
    },
    clearUser(state, action) {
      return null // Xóa trắng khi đăng xuất
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// THUNK ACTION: Xử lý quy trình Đăng nhập
export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      
      // Lưu vào Local Storage để F5 không bị mất phiên đăng nhập
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      // Gắn token cho các request gọi API Blog sau này
      blogService.setToken(user.token)
      
      // Cập nhật Redux Store
      dispatch(setUser(user))
      
      // Bắn thông báo chào mừng
      dispatch(setNotification(`Welcome ${user.name}`, 'success'))
    } catch (error) {
      // Bắn thông báo lỗi nếu sai pass
      dispatch(setNotification('Wrong username or password', 'error'))
    }
  }
}

// THUNK ACTION: Xử lý quy trình Đăng xuất
export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clearUser())
    dispatch(setNotification('Logged out successfully', 'success'))
  }
}

export default userSlice.reducer