
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connectign to ', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to Mongo DB')
    })
    .catch(error => {
        console.log('error connecting to Mongo DB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters'],
        required: true
    },
    number: {
        type: String,
        minLength: [8,'Number must be at least 8 characters'],
        validate: {
            validator: v => /^\d{2,3}-\d{5,}$/.test(v) ,
            message: prop =>
                `${prop.value} is not a valid format phone number`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)