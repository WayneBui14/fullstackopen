const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    return await response.json()
}

const createNew = async (content) => {
    const object = { content, votes: 0 }
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    })
    return await response.json()
}

// THÊM HÀM UPDATE NÀY VÀO
const update = async (id, newObject) => {
    // Đường dẫn API bây giờ sẽ có thêm id ở đuôi: /anecdotes/:id
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObject)
    })
    return await response.json()
}

// Đừng quên export nó ra nhé
export default { getAll, createNew, update }