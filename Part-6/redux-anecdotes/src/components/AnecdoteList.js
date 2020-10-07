import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

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
  const anecdotes = useSelector(state => state)

  return (
    <ul>
      {anecdotes
        .sort((prev, next) => next.votes - prev.votes)
        .map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => dispatch(addVote(anecdote.id))}
          />
        )}
    </ul>
  )
}

export default AnecdoteList