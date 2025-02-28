const express = require('express');
const app = express();

const persons = [
    { id: 1, name: "Alice", number: "123-456-7890" },
    { id: 2, name: "Bob", number: "987-654-3210" }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
