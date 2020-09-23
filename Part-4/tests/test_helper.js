const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '5f6b830e83f37513503943b8',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5f6b830e83f37513503943b8',
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '5f6b830e83f37513503943b8',
    blogs: ['5a422a851b54a676234d17f7','5a422aa71b54a676234d17f8'],
    username: 'Rafia',
    passwordHash: '$2b$10$gX46edCUM53ZHHxux238yO22jP1Hy5oOrFx1oQMqdIuSX2qc8eyuW',
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb
}