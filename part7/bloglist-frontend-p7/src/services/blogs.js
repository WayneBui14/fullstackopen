import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const getConfig = () => ({ headers: { Authorization: token } })

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}
const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, getConfig())
  return response.data
}

const remove = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return request.data
}

const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return response.data
}

export default { getAll, setToken, create, update, remove, addComment }
