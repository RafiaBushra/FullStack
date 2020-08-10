import React from 'react'

const Display = ({ person, deleteHandler }) => {
    return (
      <div>
          {person.name} {person.number} 
          <button onClick={() => deleteHandler(person.id)}>Delete</button>
      </div>
    )
}

export default Display