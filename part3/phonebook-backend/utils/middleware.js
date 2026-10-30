
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info(
    `${request.method} ${request.path}`,
    request.body && Object.keys(request.body).length
      ? request.body
      : ''
  )
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'Unknown endpoint',
  })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'Invalid ID',
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  if (error.name === 'SyntaxError' && error.status === 400) {
    return response.status(400).json({
      error: 'Invalid JSON',
    })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({
      error: 'A duplicate value was submitted',
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
