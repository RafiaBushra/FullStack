const lod = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, prev) => sum + prev.likes

  return blogs.length? blogs.reduce(reducer, 0) : 0
} // Reduces the blogs array to the sum of the 'likes' property of each entry. Returns 0 if blog list is empty.

const favoriteBlog = (blogs) => {
  blogs.sort((prev, next) => {
    if (prev.likes > next.likes) return -1
    else return 1
  })
  return blogs.length? blogs[0] : null
} // Sorts the blog list based on likes in descending order and returns the highest liked blog. Returns null if blog list is empty.

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
} // lod.countBy fills blogCount with containers where the key is the Author and the value is the number of blogs by that author. Then the for...of loop calculates which container has the highest value and that is the author with most blogs.

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
} // lod.groupBy fills authors with containers where the key is the Author and the value is an array of Blog objects containing the blogs written by that author. The first for...of loop calculates the total likes acquired by each author by going through each container of Blog arrays and reducing them. The second for...of loop calculates which container has the maximum number of likes and that is the most popular author.

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}