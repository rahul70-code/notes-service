const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.splat(),
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' })
    ),
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'combined.log'
        })
    ]
});

logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));


module.exports = logger;