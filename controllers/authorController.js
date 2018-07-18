const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article');

// author index route
router.get('/', (req, res) => {
  Author.find({}, (err, foundAuthors) => {
    if(err) console.log(err);
    else {
      res.render('authors/index.ejs', {
        authors: foundAuthors
      })
    }
  })
})

// author new route
router.get('/new', (req, res) => {
  res.render('authors/new.ejs')
})

// show route -- must go below new in the controller (why?)
router.get('/:id', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) => {
    if(err) console.log(err);
    else {
      res.render('authors/show.ejs', {
        author: foundAuthor
      })
    }
  })
})

// author create route
router.post('/', (req, res) => {
  // see what user typed
  console.log(req.body)

  // Use mongoose to add the author user entered
  Author.create(req.body, (err, createdAuthor) => {
    if(err) console.log('mongoose query error in author create route', err);
    else {
      console.log(createdAuthor)
      console.log("^^^^here's the author you created")
      res.redirect('/authors')
    }
  })
})


// destroy route
router.delete('/:id', (req, res) => {

  // delete the Author
  Author.findByIdAndRemove(req.params.id, (err, foundAuthor)=>{

    // build a list of article ids for all the articles by this author
    const articleIds = [];
    for (let i = 0; i < foundAuthor.articles.length; i++) {
      articleIds.push(foundAuthor.articles[i]._id);
    }
    // remove all articles where the _id is "in" the array we just built
    Article.remove(
      {
        _id : {
          $in: articleIds
        }
      },
      (err, data)=>{
        if(err) console.log(err);
        else {
          res.redirect('/authors');
        }
      }
    );
  });
})


// edit route
router.get('/:id/edit', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) => {
    res.render('authors/edit.ejs', {
      author: foundAuthor
    })
  })
})


//update route
router.put('/:id', (req, res) => {
  Author.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true },
    (err, updatedAuthor) => {
      if(err) console.log(err);
      else {
        res.redirect('/authors')
      }
    }
  );
})


module.exports = router;