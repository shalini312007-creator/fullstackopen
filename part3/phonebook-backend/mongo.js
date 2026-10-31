const mongoose = require('mongoose')
const config = require('./utils/config')

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const args = process.argv

if (args.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    if (args.length === 3) {
      console.log('Phonebook:')
      return Person.find({}).then(persons => {
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
      })
    }

    const person = new Person({
      name: args[2],
      number: args[3]
    })

    return person.save().then(() => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
    })
  })
  .then(() => mongoose.connection.close())
  .catch(error => {
    console.error(error)
    mongoose.connection.close()
  })