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
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedArticle = await Article.findByIdAndRemove(req.params.id);
    const foundAuthor = await Author.findOne({'articles._id':req.params.id});
    foundAuthor.articles.id(req.params.id).remove();
    const result = await foundAuthor.save();
    res.redirect('/articles');
  }
  catch(err) {
    console.error(err, " query error in Article show route")
    next(err) 
  }
})

//edit
router.get('/:id/edit', async (req, res, next) => {

  try {
    // get this article
    const foundArticle = await Article.findById(req.params.id); 
    // get all the authors to populate drop down on edit page
    const allAuthors = await Author.find({})
    // find the author who has this article in their articles array
    const foundArticleAuthor = await Author.findOne({'articles._id': req.params.id})
    res.render('articles/edit.ejs', {
      article: foundArticle,
      authors: allAuthors,
      articleAuthor: foundArticleAuthor
    });     
  }
  catch(err) {
    console.error(err, " query error in Article show route")
    next(err) 
  }
})

// article update
router.put('/:id', async (req, res, next)=>{
  try {
    // find and update the article in articles collection
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body,  { new: true });
    // find the author that previously had this article in their articles[] array
    const foundAuthor = await Author.findOne({ 'articles._id' : req.params.id })
    console.log(foundAuthor, " this is foundAuthor")

    // if a new author was chosen 
    if(foundAuthor._id.toString() !== req.body.authorId) { 
      console.log("-------------------> author was changed")
      // remove the article from the old author's article array
      foundAuthor.articles.id(req.params.id).remove();
      // save old author's article array (with the article removed), ...
      const savedFoundAuthor = await foundAuthor.save();
      // then get the new author id from req.body (based on what user chose on edit page)
      const newAuthor = await Author.findById(req.body.authorId);
      // and add it to their array
      newAuthor.articles.push(updatedArticle);
      // and save it to database
      const savedNewAuthor = await newAuthor.save();
      res.redirect('/articles/' + req.params.id);
    } 
    // otherwise (if author was not edited)
    else {
      // remove old article
      foundAuthor.articles.id(req.params.id).remove();      
      // push updated article
      foundAuthor.articles.push(updatedArticle);  
      // save and redirect
      const result = await foundAuthor.save()
      res.redirect('/articles/' + req.params.id);
    }
  }
  catch (err) {
    console.error(err, " query error in Article show route")
    next(err) 
  }
});



module.exports = router;
