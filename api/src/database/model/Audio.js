const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  locale: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
})

const Audio = mongoose.model('Audio', schema)

module.exports = {
  Audio,
  schema
}