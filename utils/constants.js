require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    NOTES_DB: process.env.NOTES_DB,
    NOTES_COLLECTION: "notes"
}