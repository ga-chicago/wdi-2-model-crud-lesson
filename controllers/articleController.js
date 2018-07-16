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

// show
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    if(err) {
      console.error('mongoose error', err);
      res.send(500, "there was an error check the terminal")
    }
    else {
      res.render('articles/show.ejs', {
        article: foundArticle
      })
    }    
  })
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
