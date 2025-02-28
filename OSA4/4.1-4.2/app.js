const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

// Connect to MongoDB
mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Error connecting to MongoDB:', err.message))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// Use routers
app.use('/api/blogs', blogsRouter)

// Error handling
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
