const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Author = require('../models/author');

// index
router.get('/', async (req, res, next) => {
  try {
    const foundArticles = await Article.find({});
    res.render('articles/index.ejs', {
      articles: foundArticles
    })        
  }
  catch (err) {
    console.error(err, " query error in Article Index route")
    next(err) // this will cause error reporting to behave the way it did before
  }
})

// new
router.get('/new', async (req, res, next) => {
  try {
    const allAuthors = await Author.find({});
    res.render('articles/new.ejs', {
      authors: allAuthors
    });
  }
  catch (err) {
    console.error(err, " query error in Article new route")
    next(err) 
  }
})

// show
router.get('/:id', async (req, res, next) => {
  try {
    const foundArticle = await Article.findById(req.params.id);
    const foundAuthor = await Author.findOne({'articles._id': req.params.id});
    res.render('articles/show.ejs', {
      author: foundAuthor,
      article: foundArticle
    });
  }
  catch(err) {
    console.error(err, " query error in Article show route")
    next(err) 
  }
})

// create
router.post('/', async (req, res, next) => {
  try {
    const foundAuthor = await Author.findById(req.body.authorId);
    const createdArticle = await Article.create(req.body);
    foundAuthor.articles.push(createdArticle);
    const result = await foundAuthor.save()
    res.redirect('/articles')
  }
  catch(err) {
    console.error(err, " query error in Article show route")
    next(err) 
  }
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
