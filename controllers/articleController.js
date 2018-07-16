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

// create
router.post('/', (req, res) => {
  console.log(req.body, "THIS IS REQ.BODY IN ARTICLE CREATE ROUTE")
  res.send("check your terminal to see if you got req.body to work--u should see data u entered in form")
})

module.exports = router;
