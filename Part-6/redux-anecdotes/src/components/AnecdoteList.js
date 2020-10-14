import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      {anecdote.content}<br />
      <strong>Has {anecdote.votes} votes.</strong>
      <button onClick={handleClick}>Vote</button>
    </li>
  )
}

const AnecdoteList = (props) => {
  const anecdotes = props.anecdotes
    .filter(anecdote => anecdote.content.toLowerCase()
      .includes(props.filter.toLowerCase()))

  const newVote = (anecdote) => {
    props.addVote(anecdote)
    props.setNotification(`You voted for '${anecdote.content}'.`, 10)
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  addVote,
  setNotification
}

const ConnectedAnecdoteList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)

export default ConnectedAnecdoteList