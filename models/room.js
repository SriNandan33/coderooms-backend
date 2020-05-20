const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'untitled',
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    code: {
      type: String,
    },
    language: {
      type: String,
      enum: ['python', 'javascript'],
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room
