const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog-wdi12', { useNewUrlParser: true })

mongoose.connection.on('connected', () => {
  console.log("mongoose is connected")
})

mongoose.connection.on('error', (err) => {
  console.log("there was an error", err)
})

mongoose.connection.on('disconnected', () => {
  console.log("mongoose is disconnected")
})