
const express = require('express')
const Person = require('./models/person')
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (request, response, next) => {
  try {
    const count = await Person.countDocuments({})
    response.send(`
      <h1>Phonebook info</h1>
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (!person) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  try {
    const { name, number } = request.body

    if (
      typeof name !== 'string' ||
      typeof number !== 'string' ||
      !name.trim() ||
      !number.trim()
    ) {
      return response.status(400).json({
        error: 'Both name and number are required',
      })
    }

    const person = new Person({
      name: name.trim(),
      number: number.trim(),
    })

    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const { name, number } = request.body

    if (
      typeof name !== 'string' ||
      typeof number !== 'string' ||
      !name.trim() ||
      !number.trim()
    ) {
      return response.status(400).json({
        error: 'Both name and number are required',
      })
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name: name.trim(), number: number.trim() },
      { new: true, runValidators: true }
    )

    if (!updatedPerson) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(request.params.id)

    if (!deletedPerson) {
      return response.status(404).json({ error: 'Contact not found' })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
