const mongoose = require('mongoose')
const Author = require('./author')

const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: {
    type: Date,
    default: Date.now
  }
})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;