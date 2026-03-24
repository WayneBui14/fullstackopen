// Import thêm useMutation và useQueryClient
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
// Import thêm updateAnecdote
import { getAnecdotes, updateAnecdote } from '../services/requests'
import NotificationContext from './NotificationContext'
const App = () => {
  // Lấy queryClient ra để dùng
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  // KHỞI TẠO MUTATION CHO VIỆC VOTE
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      // Khi vote thành công trên server, yêu cầu tải lại danh sách
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SHOW', payload: `anecdote '${updatedAnecdote.content}' voted` })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  // SỬA LẠI HÀM VOTE NÀY
  const handleVote = (anecdote) => {
    // Tạo một object mới copy từ object cũ và cộng thêm 1 vote
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App