
import { useState, useEffect } from 'react'
import axios from 'axios'

const SERVER_URL = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    axios
      .get(SERVER_URL)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.persons

        setPersons(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error(error)
        showMessage('Could not load contacts', true)
      })
  }, [])

  const showMessage = (text, error = false) => {
    setMessage(text)
    setIsError(error)
    setTimeout(() => setMessage(''), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) {
      showMessage('Enter both name and phone number', true)
      return
    }

    const existing = persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase()
    )

    if (existing) {
      if (!window.confirm(`${name} already exists. Update the number?`)) {
        return
      }

      axios
        .put(`${SERVER_URL}/${existing.id}`, { ...existing, number })
        .then((response) => {
          setPersons((previous) =>
            previous.map((person) =>
              person.id === existing.id ? response.data : person
            )
          )
          setNewName('')
          setNewNumber('')
          showMessage(`Updated ${name}`)
        })
        .catch((error) => {
          console.error(error)
          showMessage('Could not update contact', true)
        })

      return
    }

    axios
      .post(SERVER_URL, { name, number })
      .then((response) => {
        setPersons((previous) => previous.concat(response.data))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${name}`)
      })
      .catch((error) => {
        console.error(error)
        showMessage('Could not add contact', true)
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return

    axios
      .delete(`${SERVER_URL}/${person.id}`)
      .then(() => {
        setPersons((previous) =>
          previous.filter((item) => item.id !== person.id)
        )
        showMessage(`Deleted ${person.name}`)
      })
      .catch((error) => {
        console.error(error)
        showMessage('Could not delete contact', true)
      })
  }

  const visiblePersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>

      {message && (
        <p
          style={{
            color: isError ? 'red' : 'green',
            background: '#eeeeee',
            border: `2px solid ${isError ? 'red' : 'green'}`,
            padding: '10px',
          }}
        >
          {message}
        </p>
      )}

      <div>
        Filter shown with:{' '}
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>

      <h2>Add a new</h2>

      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>

      {visiblePersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person)}>Delete</button>
        </p>
      ))}
    </div>
  )
}

export default App
