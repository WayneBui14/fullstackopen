import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
// Import action notification
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes
        }
        return state.anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    })

    const dispatch = useDispatch()

    // NHẬN NGUYÊN OBJECT ANECDOTE VÀO ĐÂY
    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))

        // Hiện thông báo chứa nội dung câu chuyện
        dispatch(setNotification(`You voted '${anecdote.content}'`))

        // Hẹn giờ tắt
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        {/* TRUYỀN NGUYÊN OBJECT VÀO HÀM VOTE */}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList