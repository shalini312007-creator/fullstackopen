
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const COUNTRIES_URL =
  'https://studies.cs.helsinki.fi/restcountries/api/all'

const weatherDescription = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get(COUNTRIES_URL)
      .then((response) => {
        setCountries(
          response.data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
          )
        )
      })
      .catch((error) => {
        console.error(error)
        setError('Could not load countries. Please refresh the page.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      setWeather(null)
      return
    }

    const coordinates =
      selectedCountry.capitalInfo?.latlng ||
      selectedCountry.latlng

    if (
      !selectedCountry.capital?.length ||
      !coordinates ||
      coordinates.length < 2
    ) {
      setWeather(null)
      return
    }

    let cancelled = false

    const getWeather = async () => {
      setWeatherLoading(true)
      setWeather(null)

      try {
        const [latitude, longitude] = coordinates

        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast',
          {
            params: {
              latitude,
              longitude,
              current: 'temperature_2m,wind_speed_10m,weather_code',
            },
          }
        )

        if (!cancelled) {
          setWeather(response.data.current)
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) setWeather(null)
      } finally {
        if (!cancelled) setWeatherLoading(false)
      }
    }

    getWeather()

    return () => {
      cancelled = true
    }
  }, [selectedCountry])

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const showCountry = (country) => {
    setSelectedCountry(country)
    setSearch(country.name.common)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const countryToShow =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null)

  const languages = countryToShow?.languages
    ? Object.values(countryToShow.languages).join(', ')
    : 'No language information available'

  const renderCountry = (country) => (
    <section className="country-details" key={country.cca2}>
      <h2>{country.name.common}</h2>

      <p>
        <strong>Capital:</strong>{' '}
        {country.capital?.join(', ') || 'Not available'}
      </p>

      <p>
        <strong>Area:</strong>{' '}
        {country.area?.toLocaleString() || 'Not available'} km²
      </p>

      <p>
        <strong>Languages:</strong> {languages}
      </p>

      <p>
        <strong>Region:</strong> {country.region || 'Not available'}
      </p>

      <div className="flag-container">
        <img
          className="flag"
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
        />
      </div>

      <h3>Weather in {country.capital?.[0] || 'the capital'}</h3>

      {weatherLoading && <p>Loading weather...</p>}

      {!weatherLoading && weather && (
        <div className="weather-card">
          <p>
            <strong>Conditions:</strong>{' '}
            {weatherDescription[weather.weather_code] ||
              'Weather information available'}
          </p>

          <p>
            <strong>Temperature:</strong>{' '}
            {weather.temperature_2m} °C
          </p>

          <p>
            <strong>Wind speed:</strong>{' '}
            {weather.wind_speed_10m} km/h
          </p>
        </div>
      )}

      {!weatherLoading && !weather && (
        <p>Weather information is currently unavailable.</p>
      )}
    </section>
  )

  return (
    <main className="app">
      <header className="app-header">
        <h1>Countries Explorer</h1>
        <p>Search countries and discover their details and weather.</p>
      </header>

      <section className="search-section">
        <label htmlFor="country-search">Find countries:</label>

        <input
          id="country-search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Enter a country name..."
        />

        {loading && <p>Loading countries...</p>}
        {error && <p className="error">{error}</p>}
      </section>

      {!loading && !error && search.trim() !== '' && (
        <section className="results-section">
          {!countryToShow && filteredCountries.length === 0 && (
            <p>No countries found. Try another search.</p>
          )}

          {!countryToShow && filteredCountries.length > 10 && (
            <p>Please make your search more specific.</p>
          )}

          {!countryToShow &&
            filteredCountries.length > 1 &&
            filteredCountries.length <= 10 && (
              <div className="country-list">
                {filteredCountries.map((country) => (
                  <div className="country-row" key={country.cca2}>
                    <span>{country.name.common}</span>

                    <button
                      onClick={() => showCountry(country)}
                      type="button"
                    >
                      Show
                    </button>
                  </div>
                ))}
              </div>
            )}

          {countryToShow && renderCountry(countryToShow)}
        </section>
      )}

      <footer className="app-footer">
        Full Stack Open — Part 2, Exercises 2.18–2.20
      </footer>
    </main>
  )
}

export default App
