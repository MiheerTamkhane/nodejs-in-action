
const fs = require('node:fs');

exports.loggerMiddleware = (req, res, next) => {
    const log = `\n${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
    fs.appendFileSync('server.log', log, 'utf-8');
    next();
}