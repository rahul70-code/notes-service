const express = require('express');
const router = express.Router();
const notesRoute = require('./notes');


router.use('/notes', notesRoute); 


module.exports = router;