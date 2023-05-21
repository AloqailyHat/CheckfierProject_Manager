const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  type: String,
  name: String,
  image: String,
  date : Date
});

module.exports = mongoose.model('campaign',campaignSchema, 'campaigns');


