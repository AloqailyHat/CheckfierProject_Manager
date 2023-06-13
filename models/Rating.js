const mongoose = require ('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    phone: Number,
    date: String,
    reply:String,
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }


    
  });
  
  // Define a model 
  module.exports = mongoose.model('rating', ratingSchema, 'rates');