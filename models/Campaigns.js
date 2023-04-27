const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  type: String,
  name: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('campaign',campaignSchema, 'campaigns');


