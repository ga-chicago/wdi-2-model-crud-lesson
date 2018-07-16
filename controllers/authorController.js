const express = require('express');
const router = express.Router();

// author index route
router.get('/', (req, res) => {
  res.render('authors/index.ejs')
})

// author new route
router.get('/new', (req, res) => {
  res.render('authors/new.ejs')
})

// author create route
router.post('/', (req, res) => {
  // see what user typed
  console.log(req.body)
  // just to see if post route set up right
  res.send('you posted, check terminal to see req.body');
})

module.exports = router;