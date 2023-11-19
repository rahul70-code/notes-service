const _db = require('./index');
const _logger = require('./loggerService');
const CONSTANT = require("./constants")

const notesData = [{
    "title": "Dynamic programming",
    "content": "Content on Dynamic programming",
    "tags": [
        "DSA"
    ],
},

{
    "title": "Stack",
    "content": "Content on Stack",
    "tags": [
        "DSA"
    ],
}]



async function insertSeed() {
    let notes = await _db.mongodb.findMany(CONSTANT.NOTES_COLLECTION, {});
    if (notes.length == 0) {
        await _db.mongodb.insertMany(CONSTANT.NOTES_COLLECTION, notesData)
        _logger.info("Seed data inserted for test")
    }
}

insertSeed();