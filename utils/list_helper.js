const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const lastLike = (blogs) => {
    const lastAtBlogs = blogs.map(blog => blog.likes)
    // console.log(lastAtBlogs.length)
    return lastAtBlogs[lastAtBlogs.length - 1]
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    likes = blogs.map(b => b.likes)
    maxLikes = Math.max(...likes)
    console.log(maxLikes)

    return blogs.find(b => b.likes === maxLikes)
}

const mostBlogs = (blogs) => {

    const authorBlogs = _.map(_.countBy(blogs, "author"), (val, key) => ({author: key, blogs: val}))
    return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
    const likes = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
        'author': key,
        'likes': _.sumBy(objs, 'likes')
    })).value()

    return _.maxBy(likes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    lastLike
}