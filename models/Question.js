const mongoose = require ('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    userPhone: Number,
    date: String,
    ansower: String
  });
  
  // Define a model 
  module.exports = mongoose.model('question', questionSchema, 'questions');