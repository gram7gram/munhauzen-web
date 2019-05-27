const mongoose = require('mongoose');

const Translation = new mongoose.Schema({
  locale: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  statueTitle: {
    type: String,
    required: false
  },
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  file: {
    type: String,
    unique: false,
    required: true
  },
  type: {
    type: String,
    enum: [null, 'default', 'color', 'bonus', 'statue'],
    required: false
  },
  isAnimation: {
    type: Boolean,
    required: false
  },
  isForbidden: {
    type: Boolean,
    required: false
  },
  isBonus: {
    type: Boolean,
    required: false
  },
  isSuperBonus: {
    type: Boolean,
    required: false
  },
  translations: [
    Translation
  ],
})

const Image = mongoose.model('Image', schema)

module.exports = {Image, schema}