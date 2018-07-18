const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Author = require('../models/author');

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
  Author.find({}, (err, allAuthors)=>{
    res.render('articles/new.ejs', {
      authors: allAuthors
    });
  });
})

// show
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    if(err) {
      console.error('mongoose error', err);
      res.send(500, "there was an error check the terminal")
    }
    else {
      Author.findOne({'articles._id':req.params.id}, (err, foundAuthor)=>{
          res.render('articles/show.ejs', {
              author:foundAuthor,
              article: foundArticle
          });
      })
    }    
  })
})

// create
router.post('/', (req, res) => {
  Author.findById(req.body.authorId, (err, foundAuthor) => {
    // NOTE: req.body.authorId is ignored when creating Article due to Article Schema
    Article.create(req.body, (err, createdArticle) => {
      if(err) console.error(err);
      else {
        foundAuthor.articles.push(createdArticle)
        foundAuthor.save((err, data) => {
          res.redirect('/articles')        
        });
      }
    })
  })
})

// delete
router.delete('/:id', (req, res) => {
  Article.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
    if(err) console.log("mongoose error on article delete route", err);
    else {
      console.log("-------->successfully deleted the following:", deletedArticle);
      res.redirect('/articles')
    }
  })
})

//edit
router.get('/:id/edit', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    if(err) {
      console.error('mongoose error in edit route', err);
      res.send(500, "there was an error check the terminal")
    }
    else {
      res.render('articles/edit.ejs', {
        article: foundArticle
      })
    }    
  })
})

router.put('/:id', (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedArticle) => {
      if(err) console.log("mongoose error in update route ", err);
      else {
        console.log(updatedArticle, "updated ARticle in article update route")
        res.redirect('/articles/' + req.params.id)
      }
    }
  )
})

module.exports = router;
