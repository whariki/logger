module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send(`Hello World at ${req.dateRecieved.toISOString()}!`);
    });

    app.get('/:logger', function (req, res) {
        res.send(`getting logger ${req.params.logger} at ${req.dateRecieved.toISOString()}`)
    });
};
