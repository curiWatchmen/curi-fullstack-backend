const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// La password será el segundo argumento de la llamada
const password = process.argv[2]

const url =
  //`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
  `mongodb+srv://curiwatchmen:${password}@cluster0.2lz8k0h.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
  //mongodb+srv://curiwatchmen:hA04GcalFVErpQcn@cluster0.2lz8k0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})