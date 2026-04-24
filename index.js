
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

require('dotenv').config()

const Person = require('./models/person')

const morgan = require('morgan')

morgan.token('custom', function (request) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))

const cors = require('cors')
app.use(cors())


const PORT = process.env.PORT
app.listen(PORT,() => {
    console.log(`Server running in port ${PORT}`)
})



let persons =
    [
        {
            "id": 1,
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": 2,
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": 3,
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": 4,
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        },
        {
            "id": 11111111,
            "name": "Ali",
            "number": "1234567890"
        },
        {
            "id": 2222222,
            "name": "Tomy",
            "number": "0987654321"
        }
    ]

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch (error => {next(error)})
})

app.get('/info', (request, response) => {

    Person.countDocuments({})
        .then(count => {
            console.log('Cuantos son: ', count)
            response.send(
                `<p>Phonebook has info for ${count} people</p><p>${Date().toString()}</p>`
            )
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).json({error: 'Person not found'})
            }
        })
        .catch (error => { next(error) })

})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {next(error)})

})


app.post('/api/persons', (request, response, next) => {

    const body = request.body

    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedContact => {
            response.json(savedContact)
            console.log('New contact created')
        })
        .catch(error => {next(error)})

})

app.put ('/api/persons/:id', (request, response, next) => {

    console.log('entrando al PUT')
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {returnDocument:'after'})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorhandler = (error, request, response, next) => {

    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}
app.use(errorhandler)