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
    unique: true,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  translations: {
    type: [Translation],
    required: true
  }
})

const Chapter = mongoose.model('Chapter', schema)

module.exports = {Chapter, schema}