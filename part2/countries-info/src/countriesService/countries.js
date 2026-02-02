import axios from 'axios'
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const getWeather = (lat, lon, api_key) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
    return request.then(response => response.data)
}

export default {getAll, getWeather}