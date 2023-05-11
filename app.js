const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const Blog = require('./models/blog')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.get('/api/blogs/:id', (request, response, next) => {

    const id = request.params.id
    Blog.findById(id).then(blog => {
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    }).catch(err => next(err))
})

app.put('/api/blogs/:id', (request, response, next) => {
    const {title, author, url, likes} = request.body
    const blog = {title, author, url, likes}

    Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        }).catch(err => next(err))
})

app.use(middleware.errorHandler)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)

module.exports = app