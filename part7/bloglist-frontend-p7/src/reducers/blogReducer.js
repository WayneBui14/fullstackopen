import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    // 1. THÊM REDUCER UPDATE: Thay thế blog cũ bằng blog đã có thêm lượt like
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    // 2. THÊM REDUCER REMOVE: Lọc bỏ blog có id trùng với id bị xóa
    removeBlog(state, action) {
      const idToRemove = action.payload
      return state.filter((blog) => blog.id !== idToRemove)
    }
  }
})

// Export thêm 2 action mới
export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

// 3. THÊM THUNK ACTION LIKE
export const likeBlog = (blog) => {
  return async (dispatch) => {
    // Tạo object mới với số like tăng thêm 1
    const updatedBlogData = {
      ...blog,
      likes: blog.likes + 1,
      // Backend của khoá học FSO đôi khi yêu cầu id của user thay vì object user khi update
      user: blog.user.id || blog.user
    }

    // Gọi API PUT
    const returnedBlog = await blogService.update(blog.id, updatedBlogData)

    // Dispatch action để cập nhật Redux state
    dispatch(updateBlog(returnedBlog))
  }
}

// 4. THÊM THUNK ACTION DELETE
export const deleteBlog = (id) => {
  return async (dispatch) => {
    // Gọi API DELETE
    await blogService.remove(id)

    // Dispatch action xóa khỏi Redux state
    dispatch(removeBlog(id))
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment)
    dispatch(updateBlog(updatedBlog))
  }
}

export default blogSlice.reducer
