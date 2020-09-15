// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]
// const entryName = process.argv[3]
// const entryNum = process.argv[4]

// const url =
//   `mongodb+srv://Rafia:${password}@cluster0.mhopj.mongodb.net/phonebook?retryWrites=true&w=majority`
  
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
//   date: Date,
// })

// const Person = mongoose.model('Person', personSchema)

// if (entryName) {
//     const person = new Person({
//       name: entryName,
//       number: entryNum,
//       date: new Date(),
//     })
    
//     person.save().then(result => {
//       console.log(`Added ${entryName} number ${entryNum} to phonebook.`)
//       mongoose.connection.close()
//     })
// }
// else {
//     Person.find({}).then(result => {
//         console.log('Phonebook:')
//         result.forEach(person => {
//           console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//       })
// }