const express = require('express');
const app = express();

// run our database connection code
require('./db/db');

app.listen(3000, () => {
  console.log("Express server running")
})