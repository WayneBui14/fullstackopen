import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
// Chỉ import duy nhất setNotification
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') return state.anecdotes
        return state.anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    })

    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote))

        // GỌI THUNK: Truyền nội dung và số giây (ví dụ: 5 giây)
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList