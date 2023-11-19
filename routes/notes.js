const express = require("express");
const router = express.Router();
const _db = require('../utils/index')

const mongoose = require("mongoose");
const _logger = require('../utils/loggerService')
const CONSTANT = require('../utils/constants')

// post a new note
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes module
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Post a note
 *     tags: [Notes]
 *     requestBody:
 *       description: note data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              title:
 *               type: string
 *               example: "API Gateway"
 *              content:
 *               type: string
 *               example: "API Gateway Content"
 *              tags:
 *               type: array
 *               example: ["web development"]
 *     responses:
 *       '200':
 *         description: A successful response after creating a note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes created Successfully"
 *       '400':
 *         description: Bad request 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes validation failed: title: Path `title` is required."
 */
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

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get a Notes
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: comma seperated tags
 *     responses:
 *       '200':
 *         description: A successful response with the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                           type: string
 *                          title:
 *                           type: string
 *                          tags:
 *                           type: array
 *                           items:
 *                              type: string
 *                          createdAt:
 *                           type: string
 *                          updatedAt:
 *                           type: string
  *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
// fetch notes
router.get("/", async (req, res) => {
    try {
        let query = req.query.tags ? { tags: { $in: req.query.tags.split(",") } } : {};
        const notes = await _db.mongodb.findMany(CONSTANT.NOTES_COLLECTION, query);
        res.status(200).send({ notes, count: notes.length })
    } catch (err) {
        _logger.error("Error in fetch note", err)
        res.status(500).send({ message: "Internal server error" })
    }
})

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a Note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: note id
 *     responses:
 *       '200':
 *         description: A successful response with the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: object
 *                   properties:
 *                          _id:
 *                           type: string
 *                          title:
 *                           type: string
 *                          tags:
 *                           type: array
 *                           items:
 *                              type: string
 *                          createdAt:
 *                           type: string
 *                          updatedAt:
 *                           type: string
 *       '404':
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
// Fetch note by Id
router.get("/:id", async (req, res) => {
    try {
        let noteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).send({ message: "Invalid Note Id" })
        const note = await _db.mongodb.findById(CONSTANT.NOTES_COLLECTION, noteId);
        if (note) res.status(200).send({ note })
        else res.status(404).send({ message: "Note not found" })
    } catch (err) {
        _logger.error("Error in fetch note by Id", err)
        res.status(500).send({ message: "Internal server error" })
    }

});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: note id
 *     requestBody:
 *       description: note data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              title:
 *               type: string
 *               example: "API Gateway"
 *              content:
 *               type: string
 *               example: "API Gateway Content"
 *              tags:
 *               type: array
 *               example: ["web development"]
 *     responses:
 *       '200':
 *         description: A successful response after creating a note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes created Successfully"
 *       '400':
 *         description: Bad request 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes validation failed: title: Path `title` is required."
 *       '422':
 *         description: Unprocessed entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Duplicate title"
 */
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
            _logger.error('Duplicate key error: '+ err.keyValue);
            res.status(422).send({ name: err.name, message: "Duplicate title" })
        }
        else
            res.status(500).send({ message: "Internal server error" })
    }
})
/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: delete a Note by NoteId
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: note id
 *     responses:
 *       '200':
 *         description: A successful response after note deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: "Note deleted successfully"
 *       '404':
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
// delete note by id
router.delete("/:id", async (req, res) => {
    try {
        let noteId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(noteId)) return res.status(400).send({ message: "Invalid Note Id" })
        let deletedNote = await _db.mongodb.delete(CONSTANT.NOTES_COLLECTION, noteId);
        if (deletedNote.deletedCount > 0) res.status(200).send({ message: "Note deleted successfully" })
        else res.status(400).send({ message: "Note not found" })
    } catch (err) {
        _logger.error("Error in delete note " + err)
        res.status(500).send({ message: "Internal server error" })
    }
});

module.exports = router;