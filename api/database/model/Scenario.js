const mongoose = require('mongoose');

const Translation = new mongoose.Schema({
  locale: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
})

const Decision = new mongoose.Schema({
  scenario: {
    type: String,
    required: true
  },
  inventoryRequired: {
    type: [String]
  },
  inventoryAbsent: {
    type: [String]
  },
})

const Image = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    min: 0,
    required: true
  },
  transition: {
    type: String,
    enum: ["FADE_IN"],
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
    min: 0,
    required: true
  }
})

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  inventoryAdd: {
    type: String,
    required: false
  },
  action: {
    type: String,
    enum: ["CLICK", "GOTO"],
    required: true
  },
  audio: {
    type: [Audio]
  },
  images: {
    type: [Image]
  },
  decisions: {
    type: [Decision],
    required: true
  },
  translations: {
    type: [Translation],
    required: true
  },
})

const Scenario = mongoose.model('Scenario', schema)

module.exports = {
  Scenario,
  schema
}