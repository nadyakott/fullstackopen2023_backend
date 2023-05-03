const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://dolllove:${password}@phonebook.eihhkou.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => console.log(p.name,p.number))
        mongoose.connection.close()
    })
} else {
    contact.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
