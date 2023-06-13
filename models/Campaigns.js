const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  type: String,
  name: String,
  image: String,
  date : Date,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' }

});

module.exports = mongoose.model('campaign',campaignSchema, 'campaigns');


