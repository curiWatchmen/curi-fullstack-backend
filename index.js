const express = require("express");
const app = express();
const cors = require('cors')

// MIDDLEWARE
// Json-parser de express (middleware)
app.use(express.json());
// Los middleware se usan en orden y normalmente al principio del fichero (antes de las rutas)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
// Cors para permitir que localhost:3001 se comunique con localhost:3000
app.use(cors())
// static para hacer que el backend muestre el contenido del index.html
// que hemos copiado de la carpeta /build del front end
app.use(express.static('build'))

// NOTAS
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hola Mundo!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// :id para recibir un parámetro
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); // Podemos pasar el id a Number o hacer la comparación con ==
  const note = notes.find((note) => note.id === id);
  // Controlamos que se solicite un id que no existe devolviendo un 404
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post("/api/notes", (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  const body = request.body;

  if ((!body.content)) {
    response.status(400).json({error: "content missing"});
  } else {
    const note = {
      id: generateId(),
      content: body.content,
      important: Boolean(body.important) || false,
    };

    notes = notes.concat(note);
    response.json(note);
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  // Nuevo objeto donde almacena todos salvo el que se quiere eliminar
  notes = notes.filter((note) => note.id !== id);
  // Tanto si lo encuentra como si no, devolvemos 204
  response.status(204).end();
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// FUNCIONES
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}



// MIDDLEWARE

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// FIN MIDDLEWARE

// Este middleware se usa en caso de que no se haya encontrado ninguna ruta
// Por eso se pone al final del fichero.
app.use(unknownEndpoint)