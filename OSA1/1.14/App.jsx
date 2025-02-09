import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const generateRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const voteAnecdote = () => {
    const copy = [...votes] 
    copy[selected] += 1 
    setVotes(copy) 
  }

  const mostVotedIndex = votes.indexOf(Math.max(...votes))
  const mostVotedAnecdote = anecdotes[mostVotedIndex]
  const mostVotes = votes[mostVotedIndex]

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>
      <button onClick={voteAnecdote}>Vote</button>
      <button onClick={generateRandomAnecdote}>Next Anecdote</button>

      <h2>All Anecdotes</h2>
      <table>
        <thead>
          <tr>
            <th>Anecdote</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {anecdotes.map((anecdote, index) => (
            <tr key={index}>
              <td>{anecdote}</td>
              <td>{votes[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Anecdote with the most votes</h2>
      <p>{mostVotedAnecdote}</p>
      <p>Has {mostVotes} votes</p>
    </div>
  )
}

export default App
