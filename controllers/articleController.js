const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// index
router.get('/', (req, res) => {
  Article.find({}, (err, foundArticles) => {
    res.render('articles/index.ejs', {
      articles: foundArticles
    })    
  })
})

// new
router.get('/new', (req, res) => {
  res.render('articles/new.ejs')  
})

// create
router.post('/', (req, res) => {
  Article.create(req.body, (err, createdArticle) => {
    if(err) console.error(err);
    else {
      console.log(createdArticle)
      console.log("^^^^ CREATED ARTICLE in Article create route")
      res.redirect('/articles')
    }
  })
})

module.exports = router;
