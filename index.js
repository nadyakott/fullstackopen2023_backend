const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const Blog = require('./models/blog')
const logger = require('./utils/logger')
const config = require('./utils/config')

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

const PORT = config.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
