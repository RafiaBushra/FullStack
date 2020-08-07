import React from 'react'

const Display = ({ person }) => {
    return (
      <li>{person.name} {person.number}</li>
    )
}

const Persons = (props) => {
    const filtered = !props.filter.length? props.persons : props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase()))
    console.log(filtered)
    return (
        <ul>
            {filtered.map(person => <Display key={person.name} person={person}/>)}
        </ul>
    )
}

export default Persons