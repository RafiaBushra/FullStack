import React from 'react'

const Notification = ({ message }) => {
  if (!message) return null
  if (message.startsWith('Error:')) {
    return (
      <div style={{
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }}>
        {message}
      </div>
    )
  }
  else {
    return (
      <div style={{
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }}>
        {message}
      </div>
    )
  }
}

export default Notification