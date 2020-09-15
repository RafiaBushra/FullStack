import React, { useState, useEffect } from 'react'
import Display from './components/Display'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notifications'
import shortcuts from './services/shortcuts'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    shortcuts.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  // getAll sends axios.get() request to retrieve all the persons saved in the db.json file.
  const Persons = () => {
    const filtered = !filter.length ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
      <div>
        {filtered.map((person, id) =>
          <Display key={id}
            person={person}
            deleteHandler={deletePerson} />
        )}
      </div>
    )
  } // Simply prints out the contacts in the phonebook.
  const addPerson = (event) => {
    // event.preventDefault()
    // THIS IS A TEMPORARY FIX: THE ENTRY ID IS UNDEFINED UNTIL I REFRESH THE PAGE SO THIS IS HOW I "FIXED" IT.
    const personObject = {
      name: newName,
      number: newNumber
      // id: persons[persons.length - 1].id + 1
      // new person's id would be the last person in the phonebook's id + 1
    }
    const duplicate = persons.find(person => person.name === personObject.name)
    if (duplicate) {
      personObject.id = duplicate.id
      // Since we just want to update the contact info of the person, we give them the same id and only change their phone number.
      if (window.confirm(`${personObject.name} is already added to phonebook. Replace old number with the new one?`)) {
        shortcuts.update(duplicate.id, personObject).then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id === duplicate.id ? returnedPerson : person
          ))
        })
          .catch(error => {
            setNotification(
              `Fail: the person '${personObject.name}' was already deleted from the phonebook.`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            return null
          })
        setNotification(
          `Success: updated ${personObject.name}'s number.`
        )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } // After the user confirms that he wants to replace the old number, shortcuts.update() sends a axios.put() request to server and updates the contact. Then setPersons updates the state with the modified contact.
    }
    else {
      shortcuts.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(personObject))
        })
      setNotification(
        `Success: added ${personObject.name} to phonebook.`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } // If it is a new contact then shortcuts.create() sends a axios.post request to server which adds the new contact to db.json. setPersons then adds the new contact to the end of the persons state array.
    setNewName('')
    setNewNumber('')
  } // Checks the new entry does not already exist and adds it to database.
  const deletePerson = (id) => {
    const deleteThis = persons.find(p => p.id === id)
    // Finds the person object associated with the id in the parameter.
    if (window.confirm(`Delete ${deleteThis.name}?`)) {
      shortcuts.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        }) // shortcuts.remove() sends axios.delete() request to server and removes the entry associated with the id from db.json. setPersons() then updates the persons state so the deleted contact doesn't show up anymore. 
        .catch(error => {
          setNotification(
            `Fail: the person '${deleteThis.name}' was already deleted from the phonebook.`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        }) // Not really sure why this would be the case since every single delete button is associated with a contact that definitely still exists in the database, but oh well.
      setNotification(
        `Success: deleted ${deleteThis.name} from phonebook.`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add new person</h3>
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons />
    </div>
  )
}

export default App