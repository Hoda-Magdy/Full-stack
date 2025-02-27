const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Hardcoded phonebook data
let persons = [
    { id: 1, name: "John Doe", number: "123-456-7890" },
    { id: 2, name: "Jane Smith", number: "987-654-3210" },
    { id: 3, name: "Alice Johnson", number: "456-789-1234" },
    { id: 4, name: "Bob Brown", number: "321-654-9870" }
];

// API endpoint to retrieve persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// API endpoint to retrieve a single person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

// API endpoint to add a new person
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    
    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    
    if (persons.some(p => p.name === name)) {
        return res.status(400).json({ error: "Name must be unique" });
    }
    
    const newPerson = {
        id: Math.floor(Math.random() * 1000000), // Generate a large random ID
        name,
        number
    };
    
    persons.push(newPerson);
    res.status(201).json(newPerson);
});

// API endpoint to delete a person by ID
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const initialLength = persons.length;
    persons = persons.filter(p => p.id !== id);
    if (persons.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

// Info page
app.get('/info', (req, res) => {
    const count = persons.length;
    const timestamp = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${timestamp}</p>`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
