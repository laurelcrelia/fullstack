import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const personsToShow = showFiltered
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      );

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const person = persons.find((person) => person.name === newName);
    if (person) {
      if (
        window.confirm(
          `${person.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updateNumber(person.id);
      }
    } else {
      personService
        .createPerson(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNotificationMessage(`Added ${newName}`);
          setNotificationType("success");
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setNotificationMessage(error.response.data.error);
          setNotificationType("error");
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          console.log(error.response.data);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setNotificationMessage(`${person.name} was deleted`);
        setNotificationType("success");
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const updateNumber = (id) => {
    const person = persons.find((n) => n.id === id);
    const changedNumber = { ...person, number: newNumber };

    personService
      .updatePerson(id, changedNumber)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id !== id ? person : returnedPerson))
        );
        setNotificationMessage(`Updated ${person.name}'s number`);
        setNotificationType("success");
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNotificationMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setNotificationType("error");
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        } else {
          setNotificationMessage(`Updating ${person.name}'s number  failed.`);
          setNotificationType("error");
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        }
      });
  };

  const handleFilterName = (event) => {
    event.preventDefault();
    setShowFiltered(false);
    setNewFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      deletePerson(person.id);
    } else {
      return;
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} type={notificationType} />

      <Filter value={newFilter} onChange={handleFilterName} />

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <PersonList persons={personsToShow} onDelete={handleDelete} />
    </div>
  );
};

export default App;
