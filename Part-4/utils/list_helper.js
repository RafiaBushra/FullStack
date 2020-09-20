const lod = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, prev) => sum + prev.likes

  return blogs.length? blogs.reduce(reducer, 0) : 0
}

const favoriteBlog = (blogs) => {
  blogs.sort((prev, next) => {
    if (prev.likes > next.likes) return -1
    else return 1
  })
  return blogs.length? blogs[0] : null
}

const mostBlogs = (blogs) => {
  if(!blogs.length) return null
  const blogCount = lod.countBy(blogs, 'author')
  let max = 0
  let maxAuth = {}
  for (const [key, value] of Object.entries(blogCount)) {
    if (value > max) {
      max = value
      maxAuth = {
        author:key,
        blogs:value
      }
    }
  }
  return maxAuth
}

const mostLikes = (blogs) => {
  if(!blogs.length) return null
  const authors = lod.groupBy(blogs, 'author')
  const reducer = (sum, prev) => {
    return sum + prev.likes
  }
  let authorLikes = []
  for (const [key, value] of Object.entries(authors)) {
    const likes = value.reduce(reducer, 0)
    authorLikes.push({
      author:key,
      likes:likes
    })
  }
  let max = 0
  let maxAuth = {}
  for (const entry of authorLikes){
    if(entry.likes > max) {
      max = entry.likes
      maxAuth = {
        author:entry.author,
        likes:entry.likes
      }
    }
  }
  return maxAuth
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}