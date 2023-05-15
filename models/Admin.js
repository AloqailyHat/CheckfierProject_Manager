const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  business_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  password: {
    type:String,
    required: true
  }
});
module.exports = mongoose.model('admin', AdminSchema, 'admin');

 

