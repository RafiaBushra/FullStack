const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('../app')

let TOKEN = ''
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  } // Re-initializes the blog list for tests.

  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  } // Re-initializes the users list for tests.

  const loginUser = {
    username: 'Rafia',
    password: 'Password'
  }
  const response = await api
    .post('/api/login')
    .send(loginUser)
    .expect(200)
  TOKEN = response.body.token
  // Creates a token for POST, DELETE and PUT requests.
})

describe('When there is initially some blogs saved', () => {
  test('blogs are returned as json.', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  // *********************************************************************
  test('the unique identifier property is named \'id\'.', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.id)
    expect(ids).toBeDefined()
  })
})

describe('Adding a new blog', () => {
  test('is possible if entry has all the correct info.', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Type wars')
  })
  // *********************************************************************
  test('without a \'likes\' property defaults the value to 0.', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const latestEntry = blogsAtEnd[helper.initialBlogs.length]
    expect(latestEntry.likes).toBe(0)
  })
  // *********************************************************************
  test('without a title and url gives an error.', async () => {
    const newBlog = {
      author: 'Robert C. Martin'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Deleting a blog', () => {
  test('succeeds with status code 204 if id is valid.', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('Updating a blog', () => {
  test('succeeds if id is valid.', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const update = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 20
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(update)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const latestEntry = blogsAtEnd[0]

    expect(latestEntry.likes).toBe(20)
  })
})

describe('When there is initially one user saved', () => {
  test('creating a new user succeeds if username is unique.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rafiableh',
      name: 'Rafia Bleh',
      password: 'Password2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  // *********************************************************************
  test('creating a new user fails if username is not unique.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rafia',
      name: 'Imposter Rafia',
      password: 'Password3',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  // *********************************************************************
  test('creating a new user fails if password is missing.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rafiaboo',
      name: 'Rafia Spooks'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password is missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  // *********************************************************************
  test('creating a new user fails if password is invalid.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Rafiapleb',
      name: 'Rafia Cannot Type',
      password: 'Pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password is missing or invalid!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})