const mongoose = require('mongoose');

const Decision = new mongoose.Schema({
  order: {
    type: Number,
    required: false
  },
  scenario: {
    type: String,
    required: true
  },
  inventoryRequired: {
    type: [String],
    uppercase: true,
  },
  inventoryAbsent: {
    type: [String],
    uppercase: true,
  },
})

const Image = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    uppercase: true,
    required: false
  },
  duration: {
    type: Number,
    required: true
  },
  transition: {
    type: String,
    uppercase: true,
    required: false
  },
})

const Audio = new mongoose.Schema({
  audio: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  chapter: {
    type: String,
    required: false
  },
  expansion: {
    type: String,
    required: false
  },
  isBegin: {
    type: Boolean,
    required: false
  },
  isReserved: {
    type: Boolean,
    required: false
  },
  action: {
    type: String,
    enum: ["CLICK", "GOTO"],
    uppercase: true,
    required: false
  },
  source: {
    type: String,
    required: false
  },
  interaction: {
    type: String,
    uppercase: true,
    required: false
  },
  audio: {
    type: [Audio],
    required: false
  },
  images: {
    type: [Image],
    required: false
  },
  decisions: {
    type: [Decision],
    required: false
  },
  locale: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: false
  },
})

const Scenario = mongoose.model('Scenario', schema)

module.exports = {
  Scenario,
  schema
}