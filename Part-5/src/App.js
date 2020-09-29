import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const blogFormRef = useRef()
  let loggedInFlag = false

  useEffect(() => {
    const fetchAll = async () => {
      const response = await blogService.getAll()
      setBlogs(response)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginHelper = (user) => {
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    loggedInFlag = true
    blogService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    loggedInFlag = false
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='Login'>
          <LoginForm
            loginHelper={loginHelper}
            loggedInFlag={loggedInFlag} />
        </Togglable>
      </div>
    )
  }

  const addNewPost = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const response = await blogService.create(blogObject)
    setBlogs(blogs.concat(response))
    setNotification(`A new blog entry for ${blogObject.title} by ${blogObject.author} added!`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const blogForm = () => (
    <Togglable buttonLabel='New entry' ref={blogFormRef}>
      <BlogForm createBlog={addNewPost} />
    </Togglable>
  )

  const addLikes = async (blogObject) => {
    try {
      await blogService.update(blogObject.id, blogObject)
      let temp = [...blogs]
      temp[temp.findIndex(blog => blog.id === blogObject.id)].likes = blogObject.likes
      setBlogs(temp)
      setNotification(`Updated likes for ${blogObject.title}!`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('Error: update failed!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const removeEntry = async (id) => {
    try {
      await blogService.remove(id)
      let temp = [...blogs]
      const removed = temp.splice(temp.findIndex(blog => blog.id === id), 1)
      setBlogs(temp)
      setNotification(`Deleted ${removed.title} from blog list.`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification('Error: removal failed!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={notification} />
      {user === null
        ?
        <div>
          <h2>Log into the application.</h2>
          {loginForm()}
        </div>
        :
        <div>
          <p>{user.name} logged-in.</p>
          <button onClick={handleLogout}>Log out</button>
          {blogForm()}
          <h2>Blogs</h2>
          {blogs.sort((prev, next) => next.likes - prev.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              addLikes={addLikes}
              removeEntry={removeEntry}
              currentUser={{ name: user.name, id: user.id }} />
          )}
        </div>
      }
    </div>
  )
}

export default App