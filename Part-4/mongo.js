/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://Rafia:${password}@cluster0.mhopj.mongodb.net/bloglist?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Writers\' Block? Deal With It!',
  author: 'Rafia Bushra',
  url: 'https://rafiabee.blogspot.com/',
  likes: 0
})

/*
blog.save().then(response => {
  console.log('New blog saved!');
  mongoose.connection.close();
})
*/

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})