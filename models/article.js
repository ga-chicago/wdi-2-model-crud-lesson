const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: String,
  date: {
    type: Date,
    default: Date.now
  }
})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;