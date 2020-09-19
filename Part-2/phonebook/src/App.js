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
  // getAll sends axios.get() request to retrieve all the persons saved in the db.
  const Persons = () => {
    const filtered = !filter.length ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    // persons contains all the entries in the database. If the filter text field is empty, the page will display all the entries. Otherwise it will display the filtered entries.
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
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const duplicate = persons.find(person => person.name === personObject.name)
    // This is to check if the new entry is an update of an existing contact. 
    if (duplicate) { // If it is an update:
      personObject.id = duplicate.id
      // Since we just want to update the contact info of the person, we give them the same id and only change their phone number.
      if (window.confirm(`${personObject.name} is already added to phonebook. Replace old number with the new one?`)) {
        shortcuts.update(duplicate.id, personObject).then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id === duplicate.id ? returnedPerson : person
          ))
          setNotification(
            `Success: updated ${personObject.name}'s number.`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
          .catch(error => {
            setNotification(`Fail: ${error.response.data.error}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            return null
          })

      } // After the user confirms that he wants to replace the old number, shortcuts.update() sends a axios.put() request to server and updates the contact. Then setPersons updates the state with the modified contact.
    }
    else { // If it is a new contact:
      shortcuts.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(personObject))
          setNotification(
            `Success: added ${personObject.name} to phonebook.`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          shortcuts.getAll()
            .then(initialPersons => {
              setPersons(initialPersons)
            }) // After creating a new entry, its ID is not yet available in the persons displayed on the page. We fetch the data again just to avoid problems later if we want to modify the entry without refreshing the page.
        })
        .catch(error => {
          setNotification(`Fail: ${error.response.data.error}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    } // If it is a new contact then shortcuts.create() sends a axios.post request to server which adds the new contact to db. setPersons then adds the new contact to the end of the persons state array.
    setNewName('')
    setNewNumber('')
  } // Updates existing entry's number or adds new entries to database.
  const deletePerson = (id) => {
    const deleteThis = persons.find(p => p.id === id)
    // Finds the person object associated with the id in the parameter.
    if (window.confirm(`Delete ${deleteThis.name}?`)) {
      shortcuts.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(
            `Success: deleted ${deleteThis.name} from phonebook.`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
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

    }
  }
  // ********************** EVENT HANDLING **********************
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