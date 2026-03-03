import { useState, useEffect } from 'react'
import './App.css'
import getAllCountries from './countriesService/countries'
import axios from 'axios'
const api_key = import.meta.env.VITE_Weather_API
const CountryDetail = ({ country }) => {
  // Nhận prop country từ App, khởi tạo state weather = null
  const [weather, setWeather] = useState(null)
  // Lấy thủ đô và tọa độ từ prop country
  const capital = country.capital ? country.capital[0] : 'N/A'
  const lat = country.capitalInfo?.latlng?.[0]
  const lon = country.capitalInfo?.latlng?.[1]
  // Render lần đầu hiển thị tên nước, diện tích, ngôn ngữ, cờ
  // UseEffect chạy sau render, nếu có api_key, lat, lon thì mới gọi API OpenWeatherMap
  useEffect(() => {
    // Kiểm tra nếu có API key và tọa độ thì mới gọi API
    if (api_key && lat !== undefined && lon !== undefined) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
        .then(response => setWeather(response.data))
        .catch(error => {
          console.log('Weather error', error)
        })
    } else {
      setWeather('unavailable')
    }
  }, [lat, lon])
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {/* Object.values(country.languages || {}) trả về một array các giá trị của object, nếu country.languages
        là null thì trả về object rỗng {} tránh lỗi khi map */}
        {Object.values(country.languages || {}).map(lang =>
          <li key={lang}>{lang}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />
      {weather === 'unavailable' ? (
        <p>Weather data unavailable for this country</p>
      ) : weather ? (
        <div>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt='weather icon'
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAllCountries()
      .then(init => setCountries(init))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countriesToShow.length === 1 ? (
        <CountryDetail country={countriesToShow[0]} />
      ) : (
        <ul>
          {countriesToShow.map(country => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => setFilter(country.name.common)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App