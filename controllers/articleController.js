const express = require('express');
const router = express.Router();

// index
router.get('/', (req, res) => {
  res.send('You hit the articles index route')
})

module.exports = router;
