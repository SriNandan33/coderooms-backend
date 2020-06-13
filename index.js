const logger = require('./utils/logger')
const config = require('./utils/config')
const http = require('http')
const app = require('./app')
const socketIO = require('socket.io')

const server = http.createServer(app)

// socketIO handlers
const sockets = socketIO(server).of('/sockets/room')
sockets.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.roomId)
  })
  socket.on('code-edited', (data) => {
    socket.to(data.roomId).emit('code-edited', data)
  })
})

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})
