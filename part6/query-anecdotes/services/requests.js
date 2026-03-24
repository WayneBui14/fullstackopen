const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)

    // NẾU KHÔNG CÓ DÒNG NÀY, REACT QUERY SẼ KHÔNG BẮT ĐƯỢC LỖI SERVER
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return response.json()
}
export const createAnecdote = async (newAnecdote) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAnecdote)
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return response.json()
}
export const updateAnecdote = async (updatedAnecdote) => {
    const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnecdote)
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    return response.json()
}