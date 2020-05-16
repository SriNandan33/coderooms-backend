const roomRouter = require('express').Router()
const Room = require('../models/room')
const { validateJWT } = require('../utils/middleware')
const { validate } = require('express-validation')
const { roomValidator } = require('../validators/room')

roomRouter.get('/', validateJWT, async (request, response) => {
  const rooms = await Room.find({ owner: request.user._id }).sort({
    createdAt: -1,
  })
  response.send({ rooms })
})

roomRouter.get('/:roomId', validateJWT, async (request, response) => {
  const { roomId } = request.params
  const room = await Room.findById(roomId)
  if (!room) response.status(404).send({ error: 'Not Found' })
  // TODO: follow DRY, owner check logic is being repeated in PUT endpoint below
  if (room.owner._id.toString() !== request.user._id.toString()) {
    // only owner can view the room
    response.status(401).send({ error: 'Permission denied' })
  }
  response.send({ room })
})

roomRouter.post(
  '/',
  validateJWT,
  validate(roomValidator, { keyByField: true }),
  async (request, response) => {
    const payload = request.body
    const room = await Room.create({
      ...payload,
      ...{ owner: request.user._id },
    })
    response.send({ room })
  }
)

roomRouter.put(
  '/:roomId',
  validateJWT,
  validate(roomValidator, { keyByField: true }),
  async (request, response) => {
    const { roomId } = request.params
    const payload = request.body
    const room = await Room.findById(roomId)
    // TODO: follow DRY, owner check logic is being repeated in GET endpoint above
    if (room.owner._id.toString() !== request.user._id.toString()) {
      // only owner can update the room
      response.status(401).send({ error: 'Permission denied' })
    }
    const updatedRoom = await Room.findByIdAndUpdate(roomId, payload, {
      new: true,
    })
    response.send({ room: updatedRoom })
  }
)

module.exports = roomRouter
