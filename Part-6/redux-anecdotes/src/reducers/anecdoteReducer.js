import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ENTRIES':
      return action.data
    case 'NEW_ENTRY':
      return [...state, action.data]
    case 'VOTE':
      const id = action.data.id
      const votedAnecdote = state.find(a => a.id === id)
      const changedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    default:
      return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ENTRIES',
      data: anecdotes,
    })
  }
}

export const addAnecdote = (content) => {
  return async dispatch => {
    const newEntry = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ENTRY',
      data: newEntry,
    })
  }
}

export const addVote = (votedAnecdote) => {
  return async dispatch => {
    const newVote = await anecdoteService.updateVote(votedAnecdote)
    dispatch({
      type: 'VOTE',
      data: newVote,
    })
  }
}

export default reducer