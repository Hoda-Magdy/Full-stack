import { useState, useEffect } from 'react';
import personService from './services/persons'; // Import personService
import Notification from './Notification';  // Import Notification component

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      // Ask for confirmation to update the person's number
      if (window.confirm(`${newName} is already in the phonebook. Do you want to replace the existing number with the new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`${newName}'s number was updated successfully!`);
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch(error => {
            setErrorMessage(`Error updating ${newName}'s number.`);
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
    
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons([...persons, returnedPerson]);
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`${newName} was added successfully!`);
          setTimeout(() => setSuccessMessage(null), 5000);
        })
        .catch(error => {
          setErrorMessage(`Error adding ${newName}.`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const deletePerson = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setSuccessMessage('Contact was deleted successfully!');
          setTimeout(() => setSuccessMessage(null), 5000);
        })
        .catch(error => {
          setErrorMessage('Error deleting the contact.');
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

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
