const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: 'Phone number must be in the format 09-123456 or 040-123456'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
