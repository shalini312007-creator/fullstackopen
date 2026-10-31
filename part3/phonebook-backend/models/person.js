
const mongoose = require('mongoose')
const uniqueValidatorModule = require('mongoose-unique-validator')

const uniqueValidator =
  typeof uniqueValidatorModule === 'function'
    ? uniqueValidatorModule
    : uniqueValidatorModule.default

if (typeof uniqueValidator !== 'function') {
  throw new Error('Could not load mongoose-unique-validator plugin')
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: 'Phone number must be in the format 09-123456 or 040-123456',
    },
  },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
