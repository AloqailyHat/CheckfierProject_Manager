const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  type: String,
  link: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('ad', adSchema, 'adds');


