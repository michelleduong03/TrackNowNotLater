const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: Date,
});

module.exports = mongoose.model('User', UserSchema);
