const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// run our database connection code
require('./db/db');

// middleware -- all routes must pass thru this
// therefore it needs to be before controller(s)
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'))

// controllers
const authorController = require('./controllers/authorController')
app.use('/authors', authorController)
const articleController = require('./controllers/articleController')
app.use('/articles', articleController)

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(3000, () => {
  console.log("Express server running")
})