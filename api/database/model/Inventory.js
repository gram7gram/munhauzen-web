const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    uppercase: true,
    required: true
  },
})

const Inventory = mongoose.model('Inventory', schema)

module.exports = {Inventory, schema}