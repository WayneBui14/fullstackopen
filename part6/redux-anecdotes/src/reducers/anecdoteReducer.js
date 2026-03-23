import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// SỬ DỤNG createSlice
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    // 1. Tạo câu chuyện mới: Dùng thẳng .push() của mảng!
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: getId(),
        votes: 0
      })
    },
    // 2. Vote: Tìm phần tử và cộng trực tiếp votes++ !
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes++
      }
    }
  }
})

// Xuất các Action Creators do RTK tự động sinh ra
export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions

// Xuất Reducer để gắn vào store.js
export default anecdoteSlice.reducer