const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    { ValidationError } = require("express-validation"),
    loggerMiddleware = require('./middleware/logger'),
    CONSTANT = require('./utils/constants')

// to configure .env file to store sensitive data
require("./models")
require('./utils/seedDB')
// require('./swagger/swagger')

app.use(bodyParser.json());

const routes = require("./routes")

app.use('/api',
    // middleware for logging.
    loggerMiddleware
    , routes);


// middleware for request/response handling.
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

app.listen(CONSTANT.PORT, () => {
    console.log(`Server started at Port ${CONSTANT.PORT}`);
});