import React, { useState, useEffect } from 'react'
import Data from './Data'
import axios from 'axios'

const DisplayLang = ({ languages }) => {
    return (
        <div>
            {languages.map(lang => <Data key={lang.name} data={lang}/>)}
        </div>
    )
} // Prints out all the languages spoken in the parameter country.
  
const Weather = ({ weather }) => {
    if (weather.current !== undefined) {
        return (
            <div>
                <p><b>Temperature</b> {weather.current.temperature}℃</p>
                <img src={weather.current.weather_icons} alt="weather icon" />
                <p><b>Wind:</b> {weather.current.wind_speed}mph</p>
                <p><b>Direction:</b> {weather.current.wind_dir}</p>
            </div>
        )
    }
    else {
        return (
            <div>
                Weather info unavailable.
            </div>
        )
    }
} // Shows the current weather in the capital of the matched country. 

const Info = ({ country }) => {
    const [ weather, setWeather ] = useState([])
    const api_key = process.env.REACT_APP_API_KEY
    const params = {
        access_key: api_key,
        query: country.name
    }
    useEffect(() => {
        axios.get('http://api.weatherstack.com/current', {params})
        .then(response => {
            setWeather(response.data)     
        })
    }, [params])
    
    return (      
        <div>
            <h1>{country.name}</h1>
            <p>Capital {country.capital}</p>
            <p>Population {country.population}</p>
            <h2>Languages</h2>
            <DisplayLang key={country.name} languages={country.languages}/>
            <img src={country.flag} alt="flag" />
            <h3>Weather in {country.name}</h3>
            <Weather key={country.numericCode} weather={weather}/>
        </div>
    )
} // Simply prints out some information about the country and it's flag.

  export default Info