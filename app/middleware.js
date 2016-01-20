var bodyParser = require('body-parser');

module.exports = function(app) {

    // Adds time received to request
    app.use(function (req,res,next) {
        var d = new Date;
        req.dateRecieved = d;
        next();
    });

    // log request to console
    app.use(function (req,res,next) {
        console.log(`${req.dateRecieved.toISOString()} got request '${req.originalUrl}' from ${req.ip}`);
        next();
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));
}
