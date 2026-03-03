import axios from 'axios'
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

export default getAll
