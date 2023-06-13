const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  answer: [String],
  answered: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }

});
questionSchema.methods.updateAnswers = async function(answers) {
  this.answer = answers;
  this.answered = true;
  await this.save();
};

  // Define a model 
  module.exports = mongoose.model('question', questionSchema, 'questions');