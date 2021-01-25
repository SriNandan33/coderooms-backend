const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  const userForToken = {
    username: user.username,
    email: user.email,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

module.exports = { generateToken }
