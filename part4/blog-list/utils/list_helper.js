const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === null) return null
  const favorite = blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  })
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorCount = _.countBy(blogs, 'author')
  const formattedList = _.map(authorCount, (count, author) => {
    return {author: author, blogs: count}
  })
  return _.maxBy(formattedList, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorLikes = _.map(groupedByAuthor, (authorBlogs, author) => {
    return {
      author: author,
      likes: _.sumBy(authorBlogs, 'likes')
    }
  })
  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}