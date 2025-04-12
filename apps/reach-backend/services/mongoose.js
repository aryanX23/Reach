require('dotenv').config();
const mongoose = require('mongoose');

const { MONGO_URI = 'mongodb://localhost:27017' } = process.env || {};


mongoose.Promise = global.Promise;
const mongooseOptions = {
};

module.exports = () => {
  mongoose.connect(MONGO_URI, mongooseOptions);
  const db = mongoose.connection;
  return db;
};
