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
  isMenu: {
    type: Boolean,
    required: false,
    default: false
  },
  isStatue: {
    type: Boolean,
    required: true
  },
  relatedScenario: {
    type: [String],
    required: true
  },
  relatedInventory: {
    type: [String],
    required: false
  },
  statueTranslations: {
    type: [StatueTranslation],
    required: function () {
      return this.isStatue === true
    }
  }

})

const Inventory = mongoose.model('Inventory', schema)

module.exports = {Inventory, schema}