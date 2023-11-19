const express = require("express");
const router = express.Router();
const _db = require('../utils/index')

const mongoose = require("mongoose");
const _logger = require('../utils/loggerService')
const CONSTANT = require('../utils/constants')

// post a new note
router.post("/", async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        let insertNote = await _db.mongodb.insert(CONSTANT.NOTES_COLLECTION, { title, content, tags })
        if (insertNote) {
            res.status(200).send({ message: "Notes created Successfully" })
        }
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error handling
            _logger.error('Validation Error:', err.errors)
            res.status(400).send({ name: err.name, message: err.message })
        } else if (err.code === 11000) {
            // Duplicate key error handling
            _logger.error('Duplicate key error:', err.keyValue);
            res.send({ name: err.name, message: "Duplicate title" })
        }
        else {
            _logger.error("Internal server error " + err)
            res.status(500).send({ message: "Internal server error" })
        }
    }

});

// fetch notes
router.get("/", async (req, res) => {
    try {
        let query = req.query.tags ? { tags: { $in: req.query.tags.split(",") } } : {};
        const notes = await _db.mongodb.findMany(CONSTANT.NOTES_COLLECTION, query);
        res.status(200).send({ notes, count: notes.length })
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
})


// Fetch note by Id
router.get("/:id", async (req, res) => {
    try {
        let noteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).send({ message: "Invalid Note Id" })
        const note = await _db.mongodb.findById(CONSTANT.NOTES_COLLECTION, noteId);
        if (note) res.status(200).send({ note })
        else res.status(404).send({ message: "Note not found" })
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }

});

// Update a note by id
router.put("/:id", async (req, res) => {
    try {
        let noteId = req.params.id;
        if (req.body.title == "") return res.status(400).send({ name: "ValidationError", message: "Title cannot be empty" })
        if (req.body.content == "") return res.status(400).send({ name: "ValidationError", message: "Content cannot be empty" })
        if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).send({ message: "Invalid Note Id" })
        let updatedNote = await _db.mongodb.updateById(CONSTANT.NOTES_COLLECTION, noteId, req.body)
        if (updatedNote) res.status(200).send({ message: "Note updated successfully" })
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error handling
            console.error('Duplicate key error:', err.keyValue);
            res.send({ name: err.name, message: "Duplicate title" })
        }
        else
            res.status(500).send({ message: "Internal server error" })
    }
})

// delete note by id
router.delete("/:id", async (req, res) => {
    try {
        let noteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).send({ message: "Invalid Note Id" })
        let deletedNote = await _db.mongodb.delete(CONSTANT.NOTES_COLLECTION, id);
        if (deletedNote.deletedCount > 0) res.status(200).send({ message: "Note deleted successfully" })
        else res.status(400).send({ message: "Note not found" })
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
});

module.exports = router;