const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('content', (req)=>JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      }
  ]
   
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  }) // Returns list of all the entries in persons[].

  app.get('/info', (req, res) => {
    res.send(`
    <div>Phonebook has info for ${persons.length} people.</div>
    <div>${new Date()}</div>
    `)
  }) // Prints how many entries are in persons[] and exact time of sending the request to server.

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }  
    response.json(person)
  }) // Prints the info of entry corresponding to the id. Error 404 if id doesn't exist.

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)  
    response.status(204).end()
  }) // Deletes entry corresponding to the id.

  const generateId = () => {
    return Math.floor(Math.random() * Math.floor(100))
  } // Generates a random ID ranging from 1 to 100 for new notes.
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing!' 
      })
    }
    else if (!body.number) {
        return response.status(400).json({
            error: 'Number missing!'
        })
    }
    else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Person with the same name already exists in the phonebook. Name for each entry must be unique.'
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      date: new Date(),
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })