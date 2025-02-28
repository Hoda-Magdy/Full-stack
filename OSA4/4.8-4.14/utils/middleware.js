const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  logger.info('Body:', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  res.status(500).json({ error: err.message })
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
