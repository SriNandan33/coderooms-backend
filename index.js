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
    socket.to(data.roomId).emit('user-joined', data)

    socket.on('disconnect', () => {
      sockets.to(data.roomId).emit('user-disconnected')
    })
  })
  socket.on('code-edited', (data) => {
    socket.to(data.roomId).emit('code-edited', data)
  })
  socket.on('drawing', (data) => {
    socket.to(data.roomId).emit('drawing', data)
  })

  socket.on('user-video-connected', (data) => {
    socket.to(data.roomId).emit('user-video-connected', data)
  })
})

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})
