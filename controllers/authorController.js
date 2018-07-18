const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article');

// author index route
router.get('/', async (req, res, next) => {
  try {
    const foundAuthors = await Author.find({});
    res.render('authors/index.ejs', { authors: foundAuthors });
  } catch(err) {
    console.log("----> error in author index route", err);
    next(err);    
  }
})

// author new route
router.get('/new', (req, res) => {
  res.render('authors/new.ejs')
})

// author show route 
router.get('/:id', async (req, res, next) => {
  try {
    const foundAuthor = await Author.findById(req.params.id)
    res.render('authors/show.ejs', { author: foundAuthor })
  } catch(err) {
    console.log("----> mongoose error in author show route", err);
    next(err);    
  }
})

// author create route
router.post('/', async (req, res, next) => {
  try {
    const createdAuthor = await Author.create(req.body)
    res.redirect('/authors')
  } catch(err) {
    console.log("----> mongoose error in author create route", err);
    next(err);    
  }
})


// destroy route
router.delete('/:id', async (req, res, next) => {
  try {
    // delete the Author
    const foundAuthor = await Author.findByIdAndRemove(req.params.id)
    // get a list of article ids for all the articles by this author
    const articleIds = foundAuthor.articles.map(art => art._id) // what sorcery is this?!
    // remove all articles where the _id is "in" the array we just built
    const result = await Article.remove({ _id: { $in: articleIds } })
    res.redirect('/authors');
  } catch(err) {
    console.log("----> mongoose error in author delete route", err);
    next(err);    
  }
})


// edit route
router.get('/:id/edit', async (req, res, next) => {
  try {
    const foundAuthor = await Author.findById(req.params.id)
    res.render('authors/edit.ejs', { author: foundAuthor })
  }
  catch(err) {
    console.log("----> mongoose error in author edit route", err);
    next(err);   
  }
})


//update route
router.put('/:id', async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/authors')
  } catch(err) {
    console.log("----> mongoose error in author edit route", err);
    next(err);   
  }
})


module.exports = router;