import React, { useState } from 'react'
import PropTypes from 'prop-types'
import loginService from '../services/login'
import Notification from './Notification'
import '../App.css'

const LoginForm = ({ loginHelper, loggedInFlag }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      loginHelper(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('Error: wrong credentials.')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  if (loggedInFlag) {
    setUsername('')
    setPassword('')
    loggedInFlag = false
  }

  return (
    <div>
      <Notification message={notification} />
      <h2>Login</h2>

      <form
        className="loginForm"
        onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="loginButton" type="submit">Login</button>
      </form>
    </div >
  )
}

LoginForm.propTypes = {
  loginHelper: PropTypes.func.isRequired,
  loggedInFlag: PropTypes.bool.isRequired
}


export default LoginForm