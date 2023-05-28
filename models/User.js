const mongoose = require ('mongoose');
const UserSchema = new mongoose.Schema({
  phone: { type: String },
  points: { type: Number},
  status: {type: String },
  date: {type: Date},
  pointsExpiration: Date,
}, {timestamps: true}) 

this.phone = this.phone ? this.phone : undefined;
mongoose.model("user", UserSchema);