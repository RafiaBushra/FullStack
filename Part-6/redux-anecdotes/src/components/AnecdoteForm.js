import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const dispatch = useDispatch()

  const newEntry = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    dispatch(setNotification(`Added new anecdote: '${content}'`, 10))

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