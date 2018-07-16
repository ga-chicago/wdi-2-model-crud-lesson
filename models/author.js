const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  name: String
})

module.exports = mongoose.model('Author', authorSchema)