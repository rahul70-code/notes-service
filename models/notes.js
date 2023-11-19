const mongoose = require("mongoose");

// SCHEMA SETUP
const notesSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, minlength: 1, maxLength: 60 },
    content: { type: String, required: true, minlength: 1 },
    tags: [{
        type: String,
        default: undefined,
        required: false
    }]

}, { timestamps: true })

module.exports = notesSchema