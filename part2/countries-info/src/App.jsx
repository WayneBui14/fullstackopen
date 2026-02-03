import { useState, useEffect } from 'react'
import './App.css'
import getAllCountries from '../src/countriesService/countries'
import axios from 'axios'
const api_key = import.meta.env.VITE_Weather_API
const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital[0]
  const lat = country.capitalInfo?.latlng?.[0]
  const lon = country.capitalInfo?.latlng?.[1]

  useEffect(() => {
    if (api_key) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
      .then(response => setWeather(response.data))
      .catch(error => {
        console.log('Weather error', error)
      })
    }
  }, [lat, lon])
  console.log(weather)
  console.log(lat)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => 
          <li key={lang}>{lang}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      /> 
      {weather ? (
        <div>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} Celcius</p>
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
        <p>Too many mathces, specify another filter</p>
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