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
  isFailMunhauzen: {
    type: Boolean,
    default: false,
    required: true
  },
  isFailOpenedOnStart: {
    type: Boolean,
    default: false,
    required: true
  },
  isFailOpenedOnComplete: {
    type: Boolean,
    default: false,
    required: true
  },
  isFailDaughter: {
    type: Boolean,
    default: false,
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