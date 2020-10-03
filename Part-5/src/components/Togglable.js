import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import '../App.css'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideChildren = {
    display: visible ? 'none' : 'inline-block'
  }
  const showChildren = {
    display: visible ? 'inline-block' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div
        className='hideChildren'
        style={hideChildren}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div
        className='showChildren'
        style={showChildren}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable