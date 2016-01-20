var logger = require('../models/logger_model');
var mongoose = require('mongoose');

module.exports = function (app) {

    // root logger returns a list of loggers that are set up.
    // ususally mounted as a sub app /loggers
    app.get('/', function (req, res) {
        logger.find({},'name', function (error, loggers) {
            if (error) return handleError(error);
            console.log(loggers);
            res.json(`Hello World at ${req.dateRecieved.toISOString()}!\ngot response '${loggers}'`);
        });
    });

    app.post('/', function (req, res) {
        var newLogger = new logger();

        newLogger.name = req.body.name;
        newLogger.last_seq = 0;

        newLogger.save(function(err) {
            if (err) res.send(err);
            res.json({message: `Successfully added logger ${newLogger.name}`, data: newLogger})
        });
    });

    app.get('/:logger', function (req, res) {
        res.send(`getting logger ${req.params.logger} at ${req.dateRecieved.toISOString()}`)
    });
};
