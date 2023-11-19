const mongoose = require('mongoose');
const path = require('path');
const CONSTANT = require('../utils/constants')

const uri = CONSTANT.NOTES_DB;

// Use the `mongoose.connect` method to connect to the MongoDB database
mongoose.connect(uri);

// Get the default connection
const db = mongoose.connection;

// Event listeners for successful connection and error handling
db.on('connected', () => {
  console.log(`Connected to MongoDB at ${uri}`);
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Close the Mongoose connection when the Node process is terminated
process.on('SIGINT', () => {
    mongoose.connection.close()
    .then(() => {
      console.log('Mongoose connection closed successfully');
      process.exit(0)
    })
    .catch((err) => {
      console.error('Error closing Mongoose connection:', err);
    });
});

const Models = {
  notes: mongoose.model('Notes', require(path.join(__dirname, '/notes'))),
}

module.exports = Models;


