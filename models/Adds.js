const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  type: String,
  link: String,
  image: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'store',index:true }

});

module.exports = mongoose.model('ad', adSchema, 'adds');


