const mongoose = require('mongoose');

const StatueTranslation = new mongoose.Schema({
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
    uppercase: true,
    required: true
  },
  isGlobal: {
    type: Boolean,
    required: true,
    default: false
  },
  isMenu: {
    type: Boolean,
    required: false,
    default: false
  },
  isStatue: {
    type: Boolean,
    default: false,
    required: true
  },
  relatedScenario: {
    type: [String],
    required: false
  },
  relatedInventory: {
    type: [String],
    required: false
  },
  statueImage: {
    type: String,
    required: false
  },
  statueTranslations: {
    type: [StatueTranslation],
    required: false
  }

})

const Inventory = mongoose.model('Inventory', schema)

module.exports = {Inventory, schema}