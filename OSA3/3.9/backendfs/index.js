const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

let persons = [
  { id: 1, name: 'John Doe', number: '123-456-7890' },
  { id: 2, name: 'Jane Smith', number: '987-654-3210' },
  { id: 3, name: 'Alice Johnson', number: '555-123-4567' }
];

app.get('/', (req, res) => {
  res.send('<h1>Phonebook API</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

const generateId = () => {
  return persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = persons.length;
  persons = persons.filter(p => p.id !== id);
  
  if (persons.length === initialLength) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json({ message: 'Person deleted successfully' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
