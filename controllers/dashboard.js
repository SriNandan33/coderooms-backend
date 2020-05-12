const dashboardRouter = require('express').Router()
const { validateJWT } = require('../utils/middleware')

dashboardRouter.get('/', validateJWT, (request, response) => {
  response.send('dashboard')
})

module.exports = dashboardRouter
