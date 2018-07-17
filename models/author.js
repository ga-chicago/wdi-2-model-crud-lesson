const mongoose = require('mongoose');
const Article = require('./article')

const authorSchema = mongoose.Schema({
  name: String,
  articles: [Article.schema]
})

module.exports = mongoose.model('Author', authorSchema)