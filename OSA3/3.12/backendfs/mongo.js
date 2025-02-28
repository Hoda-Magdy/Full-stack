const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hoda:${password}@cluster0.1w706.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const newPerson = new Person({
  name: 'Ada Lovelace',
  number: '39-44-5323523'
})

newPerson.save().then(() => {
  console.log('Person saved!')
  mongoose.connection.close()
})
