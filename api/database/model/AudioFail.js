const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  audio: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  file: {
    type: String,
    unique: false,
    required: true
  },
  locale: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
})

const AudioFail = mongoose.model('AudioFail', schema)

module.exports = {
  AudioFail,
  schema
}