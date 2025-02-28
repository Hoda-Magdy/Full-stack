require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person'); // Import the Person model

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

// Get all persons (Retrieve from MongoDB)
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error));
});

// Get a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// Get the number of people in the database
app.get('/info', async (req, res) => {
  try {
    const count = await Person.countDocuments({});
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

// Add a new person (Store in MongoDB)
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  // Check if person already exists
  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return res.status(400).json({ error: 'Name must be unique' });
    }

    const person = new Person({ name, number });

    person
      .save()
      .then(savedPerson => res.json(savedPerson))
      .catch(error => next(error));
  });
});

// Delete a person from MongoDB
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.json({ message: 'Person deleted successfully' });
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' });
  }
  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
