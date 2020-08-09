import React from 'react'
import Data from './Data'
import Info from './Info'

const Display = ({ data, filter }) => {
  const filtered = !filter.length? [] : data.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  // If the user has not entered anything yet, filtered will be empty
  // If the user entered keywords that match some of the countries in the database, their data will be copied to filtered.
  if (!filtered.length) {
    return (
      <div>Search for country above</div>
    )
  } // If filtered is empty AKA user has not entered anything yet or there is no match for the keywords.
  else if (filtered.length > 10) {
    return (
      <div>Too many matches. Specify another filter.</div>
    )
  } // If there are too many matches (more than 10).
  else if (filtered.length === 1) {
    return (
      <div><Info key={filtered[0].numericCode} country={filtered[0]}/></div>
    )
  } // If there is only 1 match, information about that country will be displayed
  else {
    return (     
      <div>
        {filtered.map(country => {
          return (
            <div key={country.name}>
              <Data key={country.numericCode} data={country}/>
              <button onClick={() => <Info key={country.numericCode} country={country}/>}>Show</button>
            </div>
          )
        })}
      </div>
    )
  } // If there are less than 10 matches, the names of each country will be displayed in a list with a button next to each name. Pressing the button *ideally* would show the information for that country but I haven't been able to make it work (yet).
}

export default Display