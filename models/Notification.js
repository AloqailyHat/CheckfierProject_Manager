const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['question', 'redeem', 'rating'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }

});

module.exports = mongoose.model('notification', notificationSchema, 'notifications');
