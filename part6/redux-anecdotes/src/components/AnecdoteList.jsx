import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    // Lấy state từ Redux
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    // Hàm xử lý vote
    const vote = (id) => {
        dispatch(voteAnecdote(id))
    }

    // Sắp xếp mảng copy theo số vote giảm dần
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return (
        <div>
            {/* Lặp qua mảng đã sắp xếp để render */}
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList