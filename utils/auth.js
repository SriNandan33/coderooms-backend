const jwt = require('jsonwebtoken')

const DEFAULT_EXPIRY_TIME = Math.floor(Date.now() / 1000) + 60 * 60
const generateToken = (user, exp = DEFAULT_EXPIRY_TIME) => {
  const userForToken = {
    username: user.username,
    email: user.email,
    id: user._id,
    exp: exp,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET)
  return decoded
}

module.exports = { generateToken, decodeToken }
