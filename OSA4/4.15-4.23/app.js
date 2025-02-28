const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const tokenExtractor = require('./middleware/tokenExtractor');
const userExtractor = require('./middleware/userExtractor');

const app = express();

app.use(express.json());
app.use(tokenExtractor);
app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);

mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Error connecting to MongoDB:', err.message))

app.use(cors())
app.use(middleware.requestLogger)


app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
