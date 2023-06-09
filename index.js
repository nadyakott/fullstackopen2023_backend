require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

const app = express()
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/', (request, response, next) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(err => next(err))
})

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        const html_response = `<div> Phonebook has info ${persons.length} people <p> ${new Date()}</p></div>`
        response.send(html_response)
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndRemove(id).then(res => {
        response.status(204).end()
    }).catch(err => next(err))
    // persons = persons.filter(p => p.id !== id)
    // Person = Person.filter(p => p.id !== id)
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    const person = {
        name, number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
        const {name, number} = request.body

        if (!name) {
            return response.status(400).json({
                error: 'name missing'
            })
        }

        const person = new Person({name, number})

        person
            .save().then(savedPerson => {
            response.json(savedPerson)
        })
            .catch(error => next(error))
    }
)

app.get('/api/persons/:id', (request, response, next) => {

    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(err => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
