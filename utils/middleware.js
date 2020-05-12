const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const validateJWT = async (request, response, next) => {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return response.status(401).send('Token is missing')

  try {
    var decoded = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return response.status(401).send(err)
  }
  const user = await User.findOne({ email: decoded.email })
  if (!user) return response.status(404).send('User not found')

  request.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  validateJWT,
}
