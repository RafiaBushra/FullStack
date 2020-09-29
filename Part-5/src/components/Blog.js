import React, { useState } from 'react'
import '../App.css'
const Blog = ({ blog, addLikes, removeEntry, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = (event) => {
    event.preventDefault()
    addLikes({
      id: blog.id,
      likes: blog.likes + 1,
      author: blog.author,
      url: blog.url,
      title: blog.title
    })
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} from blog list?`)) removeEntry(blog.id)
  }

  const blogStyle = {
    display: 'flex',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    < div style={blogStyle} >
      {blog.title} {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} style={{ float: 'right' }}>View</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>Hide</button>
        <div style={{ float: 'left' }}>
          {blog.url}
          <p>
            Likes: {blog.likes}
            <button
              onClick={handleLike}
              style={{ display: 'inline-block' }}
            >Like</button>
          </p>
          {blog.user.name || currentUser.name}
          {currentUser.id === blog.user.id || currentUser.id === blog.user ?
            <button onClick={handleRemove}>Remove</button> : ''}
        </div>

      </div>
    </div>
  )
}

export default Blog
