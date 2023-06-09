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

    },
    code: {
      type: String,
      required: true,
    },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }

    });
  
  module.exports = mongoose.model('reward', rewardSchema, "rewards");
  