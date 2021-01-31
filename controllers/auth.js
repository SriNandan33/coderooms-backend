const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { validate } = require('express-validation')
const {
  loginValidator,
  registerValidator,
  ResetPasswordValidator,
  ForgotPasswordValidator,
} = require('../validators/auth')

const { sendEmail } = require('../utils/mail')
const { generateToken, decodeToken } = require('../utils/auth')
const { validateJWT } = require('../utils/middleware')

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
      verified: user.verified,
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
      verified: user.verified,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({
      ...userForToken,
      ...{ token, name: user.name },
    })
  }
)

authRouter.post(
  '/resend_verification_token',
  validateJWT,
  async (request, response) => {
    const email = request.user.email
    const token = generateToken(request.user)
    const url = `${process.env.CLIENT_BASE_URI}/verify/${token}`
    try {
      await sendEmail(
        email,
        'Coderooms: Verify your account',
        `Please verifiy your account by clicking the following link ${url}`
      )
      response.status(204).end()
    } catch (err) {
      response.status(500).send(err)
    }
  }
)

authRouter.post('/verify/:token', async (request, response) => {
  const token = request.params.token
  try {
    const decoded = decodeToken(token)
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      { verified: true },
      { new: true }
    )
    return response.status(200).send({ user: { ...updatedUser._doc, token } })
  } catch (err) {
    response.status(500).send(err)
  }
})

authRouter.post(
  '/forgot_password',
  validate(ForgotPasswordValidator, { keyByField: true }),
  async (request, response) => {
    const email = request.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      return response.status(404).json({
        error: 'No account found with the given email address.',
      })
    }
    const token = generateToken(user)
    const url = `${process.env.CLIENT_BASE_URI}/reset_password/${token}`
    try {
      await sendEmail(
        email,
        'Coderooms: Reset Your Password',
        `Please reset your password by clicking ${url}`
      )
    } catch (err) {
      return response.status(500).send({
        error: 'Error while reseting password',
      })
    }
    return response.status(204).end()
  }
)

authRouter.post(
  '/reset_password/:token',
  validate(ResetPasswordValidator, { keyByField: true }),
  async (request, response) => {
    const password = request.body.password
    const token = request.params.token
    const saltRounds = 10 // TODO: need to move it to config
    try {
      let passwordHash = await bcrypt.hash(password, saltRounds)
      const decoded = decodeToken(token)
      await User.updateOne(
        { email: decoded.email },
        { $set: { password: passwordHash } }
      )
      response.status(204).end()
    } catch (err) {
      response.status(400).send(err)
    }
  }
)

module.exports = authRouter
