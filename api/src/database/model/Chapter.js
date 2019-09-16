const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  chapterAudio: {
    type: String,
    required: false
  },
  number: {
    type: Number,
    min: 0,
    required: false
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

const Chapter = mongoose.model('Chapter', schema)

module.exports = {Chapter, schema}