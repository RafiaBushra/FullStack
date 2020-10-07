import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const newEntry = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={newEntry}>
        <div><input name="anecdote" /></div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm