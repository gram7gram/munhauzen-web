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
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  isReserved: {
    type: Boolean,
    default: false,
    required: false
  },
  isAnimation: {
    type: Boolean,
    required: false
  },
  isHiddenFromGallery: {
    type: Boolean,
    required: false
  },
  relatedStatue: {
    type: String,
    required: false
  },
  relatedScenario: {
    type: String,
    required: false
  },
  translations: {
    type: [Translation],
    required: false
  },
})

const Image = mongoose.model('Image', schema)

module.exports = {Image, schema}