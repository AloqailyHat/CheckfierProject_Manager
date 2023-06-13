const mongoose = require ('mongoose');

const storeSchema = new mongoose.Schema({
    name: String,
    logo: String,
    color: String,
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: 'Admin'
    }
  
    
  }, {timestamps: true});
  
  // Define a model 
  module.exports = mongoose.model('store', storeSchema, 'stores');
  