import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { notify, removeNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      {anecdote.content}<br />
      <strong>Has {anecdote.votes} votes.</strong>
      <button onClick={handleClick}>Vote</button>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter(
      anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const newVote = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(notify(`You voted for '${anecdote.content}'.`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <ul>
      {anecdotes
        .sort((prev, next) => next.votes - prev.votes)
        .map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => newVote(anecdote)}
          />
        )}
    </ul>
  )
}

export default AnecdoteList