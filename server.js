const express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    { ValidationError } = require("express-validation"),
    loggerMiddleware = require('./middleware/logger'),
    CONSTANT = require('./utils/constants'),
    swaggerUi = require('swagger-ui-express'),
    swaggerJsdoc = require('swagger-jsdoc');


// file load the models
require("./models")
// file to seed some pre-defined notes if database is empty
require('./utils/seedDB')

// parse the request body from post/put apis
app.use(bodyParser.json());

// Main routes
const routes = require("./routes")

app.use('/api',
    // middleware for logging.
    loggerMiddleware
    , routes);

/**
 * Swagger definition to document the Endpoints defined in the routes
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notes service API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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