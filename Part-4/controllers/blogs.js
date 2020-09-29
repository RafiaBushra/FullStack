const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
}) // Fetches all the blogs stored in the database.

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.likes) body.likes = 0

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token is missing or invalid!' })
  }

  const loggedUser = await User.findById(decodedToken.id)

  if (!body.title || !body.url) response.status(400).end()
  else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: loggedUser.id
    })

    const savedBlog = await blog.save()
    loggedUser.blogs = loggedUser.blogs.concat(savedBlog.id)
    await loggedUser.save()

    response.json(savedBlog)
  }
}) // Checks that a user is logged in, new entry is valid and finally saves the entry to database.

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog
    ? response.json(blog)
    : response.status(404).end()
}) // Checks that the blog in question exists and then returns it as response.

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token is missing or invalid!' })
  }

  const loggedUser = await User.findById(decodedToken.id)
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete.user.toString() === loggedUser.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else response.status(401).end()
}) // Checks that the blog to be deleted was created by the user that is logged in. If yes, then deletes the blog entry and returns status code 204.

blogsRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token is missing or invalid!' })
  }
  const loggedUser = await User.findById(decodedToken.id)
  const blogToUpdate = await Blog.findById(request.params.id)

  if (blogToUpdate.user.toString() === loggedUser.id.toString()) {

    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
      { new: true })

    response.json(updatedBlog.toJSON())
  } else response.status(401).end()
}) // Checks that the blog to be updated was created by the logged user. If yes, updates the blog entry.

module.exports = blogsRouter