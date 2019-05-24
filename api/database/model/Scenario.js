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
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  action: {
    type: String,
    enum: ["CLICK", "GOTO"],
    uppercase: true,
    required: true
  },
  inventoryRequired: {
    type: [mongoose.Schema.Types.ObjectId],
    uppercase: true,
  },
  inventoryAbsent: {
    type: [mongoose.Schema.Types.ObjectId],
    uppercase: true,
  },
})

const Image = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
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
    uppercase: true,
    required: false
  },
})

const Audio = new mongoose.Schema({
  audio: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    required: true
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