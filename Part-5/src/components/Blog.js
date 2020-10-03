import React, { useState } from 'react'
import '../App.css'

const Blog = ({ blog, addLikes, removeEntry, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const hideDetails = {
    display: visible ? 'none' : 'inline'
  }
  const showDetails = {
    display: visible ? 'inline' : 'none'
  }

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

  return (
    <div className='blog'>
      {blog.title} by {blog.author}
      <div style={hideDetails} className='hidden'>
        <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showDetails} className='visible'>
        <button onClick={toggleVisibility}>Hide</button>
        <dl>
          <dt>URL: {blog.url}</dt>
          <dt id="likes">
            Likes: {blog.likes}
            <button
              id="likeButton"
              onClick={handleLike}
            >Like</button>
          </dt>
          <dt>User: {blog.user.name || currentUser.name}</dt>
          <dt>{currentUser.id === blog.user.id || currentUser.id === blog.user ?
            <button onClick={handleRemove}>Remove</button> : ''}</dt>
        </dl>
      </div>
    </div>
  )
}

export default Blog
