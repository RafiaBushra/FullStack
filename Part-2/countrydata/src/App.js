import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Display from './components/Display'

const App = () => {
  const [ data, setData ] = useState([]) 
  const [ filter, setFilter ] = useState('')  

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }, []) // Fill data with the whole countries database

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  } 

  return (
    <div>
      Find countries 
      <input value={filter} onChange={handleFilterChange}/> 
      {/* User enters keywords to search the country by name */}
      <Display data={data} filter={filter}/>
      {/* Display component takes the database and the user input */}
    </div>
  )
}

export default App 