const express = require('express');
const router = express.Router();

// index
router.get('/', (req, res) => {
  res.render('articles/index.ejs')
})

// new
router.get('/new', (req, res) => {
  res.render('articles/new.ejs')  
})

module.exports = router;
