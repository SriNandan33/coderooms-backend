const roomRouter = require('express').Router()
const Types = require('mongoose').Types
const Room = require('../models/room')
const User = require('../models/user')
const { validateJWT } = require('../utils/middleware')
const { validate } = require('express-validation')
const { roomValidator } = require('../validators/room')
const { addGuestValidator } = require('../validators/guests')

roomRouter.get('/', validateJWT, async (request, response) => {
  const rooms = await Room.find({
    $or: [{ owner: request.user._id }, { guests: request.user._id }],
  }).sort({
    createdAt: -1,
  })
  response.send({ rooms })
})

roomRouter.get('/:roomId', validateJWT, async (request, response) => {
  const { roomId } = request.params
  // only owner, guests can view the room
  const room = await Room.findOne({
    $and: [
      { _id: roomId },
      { $or: [{ owner: request.user._id }, { guests: request.user._id }] },
    ],
  })
  if (!room) {
    response.status(404).send({ error: 'Room does not exist' })
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

roomRouter.post(
  '/:roomId/guests',
  validateJWT,
  validate(addGuestValidator, { keyByField: true }),
  async (request, response) => {
    const { roomId } = request.params
    const payload = request.body
    const guest = await User.findOne({ email: payload.email })
    if (!guest) {
      response.status(404).send({ error: 'User not found!' })
    }

    try {
      const room = await Room.findByIdAndUpdate(
        roomId,
        { $addToSet: { guests: Types.ObjectId(guest._id) } },
        { new: true, useFindAndModify: false }
      ).populate('guests')
      response.send({ room: room })
    } catch (err) {
      response.status(500).send({ error: `Can not add guest ${err}` })
    }
  }
)

module.exports = roomRouter
