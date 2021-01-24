const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { validate } = require('express-validation')
const {
  loginValidator,
  registerValidator,
  ResetValidator,
} = require('../validators/auth')

const { sendEmail } = require('../utils/mail')

const authRouter = require('express').Router()

authRouter.post(
  '/register',
  validate(registerValidator, { keyByField: true }),
  async (request, response) => {
    const body = request.body
    let user
    user = await User.exists({ email: body.email })
    if (user) {
      return response.status(400).send({
        error: 'email is already used.',
      })
    }

    user = await User.exists({ username: body.username })
    if (user) {
      return response.status(400).send({
        error: 'Username is already taken.',
      })
    }

    const saltRounds = 10 // TODO: need to move it to config
    let passwordHash = await bcrypt.hash(body.password, saltRounds)
    user = new User({
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
      ...userForToken,
      ...{ name: user.name, token: token },
    })
  }
)

authRouter.post(
  '/login',
  validate(loginValidator, { keyByField: true }),
  async (request, response) => {
    const body = request.body

    const user = await User.findOne({ email: body.email })
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(body.password, user.password)

    if (!(user && passwordCorrect)) {
      return response.status(400).json({
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
      ...userForToken,
      ...{ token, name: user.name },
    })
  }
)

authRouter.post(
  '/reset',
  validate(ResetValidator, { keyByField: true }),
  async (request, response) => {
    const email = request.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      return response.status(404).json({
        error: 'No account found with the given email address.',
      })
    }
    try {
      await sendEmail(
        email,
        'Reset Password Test',
        'Please reset your password'
      )
    } catch (err) {
      console.log(err)
      return response.status(500).send({
        error: 'Error while reseting password',
      })
    }
    return response.status(204).end()
  }
)

module.exports = authRouter
