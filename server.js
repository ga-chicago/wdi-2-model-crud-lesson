const express = require('express');
const app = express();

// run our database connection code
require('./db/db');

// controllers
const authorController = require('./controllers/authorController')
app.use('/authors', authorController)

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(3000, () => {
  console.log("Express server running")
})