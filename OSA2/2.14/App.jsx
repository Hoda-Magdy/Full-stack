import { useState, useEffect } from 'react';
import personService from './services/persons';

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    Filter shown with: <input value={filter} onChange={handleFilterChange} />
  </div>
);

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </li>
);

const Persons = ({ persons, deletePerson }) => (
  <ul>
    {persons.map((person) => (
      <Person key={person.id} person={person} deletePerson={deletePerson} />
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    
    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewNumber('');
      });
  };

  const deletePerson = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          alert('Error deleting the contact');
        });
    }
  };

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson} 
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
