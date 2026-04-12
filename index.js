// console.log('Hello mundossssssssssssssssssssss')

const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('custom', function (request) {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))



const PORT = 3001
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
        }
    ]
// app.get('/', (request, response) =>{
//     response.send('<h1>Hello worldssssssssssssssssssssss</h1>')
// })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {

    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date(8.64e15).toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find( person => person.id === id)
    if (!person){
        return response.status(404).end('No such person founded')
    } else {
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    if (!persons.find(person => person.id === id)){
        response.status(404).end('No such person founded')
    } else {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }
})

const generateId = () => {
    const maxId = 1000
    return Math.floor(Math.random() * maxId)
}

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'Contact name already created, name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})