const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authRouter = require('express').Router()

authRouter.post('/register', async (request, response) => {
  const body = request.body
  const saltRounds = 10 // TODO: need to move it to config
  let passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
    email: body.email,
    password: passwordHash,
    name: body.name,
    username: body.username,
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    email: savedUser.email,
    id: savedUser._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({
    username: user.username,
    email: user.email,
    name: user.name,
    token: token,
  })
})

authRouter.post('/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ email: body.email })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({
    username: user.username,
    email: user.email,
    name: user.name,
    token: token,
  })
})

module.exports = authRouter
