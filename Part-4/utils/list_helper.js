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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}