import React from 'react'
import '../App.css'

const Notification = ({ message }) => {
  if (!message) return null
  if (message.startsWith('Error:')) {
    return (
      <div
        className="error">
        {message}
      </div>
    )
  }
  else {
    return (
      <div
        className="success"
      >
        {message}
      </div>
    )
  }
}

export default Notification