const _logger = require('../utils/loggerService')

const loggerMiddleware = async (req, res, next) => {
    let data = { method: req.method, url: req.originalUrl };
    req.method == "POST" || req.method == "PUT" ? data["body"] = req.body : data["query"] = req.query;
    if (Object.keys(req.params).length) data["params"] = req.params;
    _logger.info(JSON.stringify(data))
    next()
};

module.exports = loggerMiddleware;
