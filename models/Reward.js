const mongoose = require ('mongoose');
const rewardSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    points: {
      type: Number,
      required: true,
      index: true

    }
  },{collation: 'rewards'});
  
  module.exports = mongoose.model('reward', rewardSchema);
  