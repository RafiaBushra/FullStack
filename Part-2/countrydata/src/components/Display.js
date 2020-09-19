import React, { useState } from 'react'
import Data from './Data'
import Info from './Info'

const ShowOne = ({ show, count }) => {
  if (count === 1) {
    return (
      <div>
        {show}
      </div>
    )
  }
  return null
} // I made this flag to get rid of the same country's information being displayed for every loop of the map function.

const Display = ({ data, filter }) => {
  const filtered = !filter.length? [] : data.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  // If the user has not entered anything yet, filtered will be empty
  // If the user entered keywords that match some of the countries in the database, their data will be copied to filtered.
  const [show, setShow] = useState([])  

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
    let count = 0
    return (     
      <div>
        {filtered.map(country => {
          count += 1
          const countryCopy = {...country, toggled: false} 
          // Never mutate state directly in a component
          const toggleInfo = () => {
            setShow(<Info key={countryCopy.numericCode} country={countryCopy}/>)
            countryCopy.toggled = true
          } // Event handler for Show button below.
          return (
            <div key={countryCopy.numericCode}>
              <Data key={country.numericCode} data={country}/>
              <button onClick={() => toggleInfo()}>
                Show                
              </button>
              <div style={{position:'absolute', right:'0', top:'0'}}>
                {!show.toggled?<ShowOne show={show} count={count}/>:null}
              </div>
              {/* If the show state has been modified, it will print the information of the country whose button has been pressed. */}
            </div>
          )
        })}
      </div>
    )
  } // If there are less than 10 matches, the names of each country will be displayed in a list with a button next to each name. Pressing the button *ideally* would show the information for that country but I haven't been able to make it work (yet).
}

export default Display