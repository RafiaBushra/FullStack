/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('content', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
}) // Returns list of all the entries in the Phonebook database.

app.get('/info', (request, response, next) => {
  Person.count({}, (error, count) => {
    if (error) next(error)
    response.send(`
    <div>Phonebook has info for ${count} people.</div>
    <div>${new Date()}</div>`)
  })
}) // Prints how many entries are in the databasse and the exact time of sending the request to server.

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => { response.json(person) })
    .catch(error => next(error))
}) // Prints the info of entry corresponding to the id. Error 404 if id doesn't exist.

app.post('/api/people', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
    id: body.id,
  })

  person.save()
    .then(savedPerson => {
      console.log(`Added ${person.name} number ${person.number} to phonebook.`)
      response.json(savedPerson)
    })
    .catch(error => next(error))

}) // Checks the validity of the new entry and then saves the valid entry to database.

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
}) // Deletes entry corresponding to the id.

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
}) // Updates the number of an existing entry.

// ********************** ERROR HANDLING **********************
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint.' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID.' })
  }
  else if (error.name === 'ReferenceError') {
    return response.status(400).send({ error: 'A variable is not defined in the code.' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'MongoError') {
    return response.status(400).json({ error: 'Person name must be unique.' })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})