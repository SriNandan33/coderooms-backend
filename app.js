const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const authRouter = require('./controllers/auth')
const dashboardRouter = require('./controllers/dashboard')
const roomRouter = require('./controllers/room')
const codeRouter = require('./controllers/code')

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(middleware.requestLogger)
}

app.use('/api/auth', authRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/code', codeRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
