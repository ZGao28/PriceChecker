// import mongoose
const mongoose = require('mongoose');

// Define User Schema
const UserSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  currency:{
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);