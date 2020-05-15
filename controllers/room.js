const roomRouter = require('express').Router()
const Room = require('../models/room')
const { validateJWT } = require('../utils/middleware')

roomRouter.get('/', validateJWT, async (request, response) => {
  const rooms = await Room.find({ owner: request.user._id }).sort({
    createdAt: -1,
  })
  response.send({ rooms })
})

roomRouter.post('/', validateJWT, async (request, response) => {
  const payload = request.body
  const room = await Room.create({ ...payload, ...{ owner: request.user._id } })
  response.send({ room })
})

module.exports = roomRouter
