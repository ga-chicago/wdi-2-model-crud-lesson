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
              author: foundAuthor,
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
      Author.findOne({'articles._id':req.params.id}, (err, foundAuthor)=>{
        foundAuthor.articles.id(req.params.id).remove();
        foundAuthor.save((err, data)=>{
            res.redirect('/articles');
        });
      });
    }
  })
})

//edit
router.get('/:id/edit', (req, res) => {
  // get this article
  Article.findById(req.params.id, (err, foundArticle) => {
    if(err) {
      console.error('mongoose error in edit route', err);
      res.send(500, "there was an error check the terminal")
    }
    else {
      // get all the authors to populate drop down on edit page
      Author.find({}, (err1, allAuthors)=>{
        if(err1) console.log(err1);
        else {
          // find the author who has this article in their articles array
          Author.findOne({'articles._id':req.params.id}, (err2, foundArticleAuthor)=>{
            if(err2) console.log(err2);
            else {       
              res.render('articles/edit.ejs', {
                article: foundArticle,
                authors: allAuthors,
                articleAuthor: foundArticleAuthor
              }); 
            } 
          }); 
        } 
      }); 
    }    
  })
})

// article update
router.put('/:id', (req, res)=>{
  // find and update the article in articles collection
  Article.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true }, 
    (err, updatedArticle)=>{
      if(err) console.log(err, "error in article update on Article.findByIdAndUpdate");
      else {
        // find the author that previously had this article in their articles[] array
        Author.findOne({ 'articles._id' : req.params.id }, (err2, foundAuthor) => {
          if(err2) console.log(err2, " error in second query (Article.findOne) in article update");
          else { 
            // if a new author was chosen 
            if(foundAuthor._id.toString() !== req.body.authorId){
              console.log("-------------------> author was changed")
              // remove the article from the old author's article array
              foundAuthor.articles.id(req.params.id).remove();
              // save old author's article array (with the article removed), ...
              foundAuthor.save((err3, savedFoundAuthor) => {
                // then get the new author id from req.body (based on what user chose on edit page)
                Author.findById(req.body.authorId, (err4, newAuthor) => {
                  // and add it to their array
                  newAuthor.articles.push(updatedArticle);
                  // and save it to database
                  newAuthor.save((err5, savedNewAuthor) => {
                    res.redirect('/articles/' + req.params.id);
                  });
                });
              });
            } 
            // or if the author was not edited
            else {
              console.log("-------------------> author was NOT changed")
              // remove old article
              foundAuthor.articles.id(req.params.id).remove();
              // push updated article
              foundAuthor.articles.push(updatedArticle);              
              // save and redirect
              foundAuthor.save((err6, data) => {
                res.redirect('/articles/' + req.params.id);
              });
            }
          }
        });
      }
    });
});

module.exports = router;
