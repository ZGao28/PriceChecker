// import mongoose
const mongoose = require('mongoose');

// Define item Schema
const ItemSchema = mongoose.Schema({
  itemName:{
    type: String,
    required: true
  },
  lowestPrice:{
    type: Number,
    required: true
  },
  userID:{
    type: String,
    required: true
  },
  currency:{
    type: String,
    required: true
  },
  url: {
      type: String,
      required: true
  },
  desiredPrice: {
      type: Number,
      required: true
  }
});

const Item = module.exports = mongoose.model('Item', ItemSchema);