import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    // ĐỔI TÊN HÀM NÀY THÀNH updateAnecdote
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      // Map qua mảng, nếu đúng ID thì thay bằng object mới từ server, sai thì giữ nguyên
      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

// Export action update thay vì vote
export const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

// THÊM THUNK ACTION CHUYÊN XỬ LÝ VOTE
export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    // 1. Tạo một object copy và tăng vote lên 1
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    // 2. Gửi request PUT lên server
    const updatedAnecdote = await anecdoteService.update(anecdote.id, changedAnecdote)

    // 3. Dispatch action đồng bộ để cập nhật giao diện
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer