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
    unique: false,
    required: true
  },
  translations: {
    type: [Translation],
    required: true
  },
})

const Audio = mongoose.model('Audio', schema)

module.exports = {
  Audio,
  schema
}