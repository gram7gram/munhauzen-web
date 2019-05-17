const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
})

const Chapter = mongoose.model('Chapter', schema)

module.exports = {Chapter, schema}