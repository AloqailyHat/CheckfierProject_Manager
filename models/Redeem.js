const mongoose = require ('mongoose');

const redeemSchema = new mongoose.Schema({
    userPhone: Number,
    points: Number
  });
  
  // Define a model 
  module.exports = mongoose.model('redeem', redeemSchema, 'redeem');