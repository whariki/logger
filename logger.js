var myConfig = require('./config.js');
var express = require('express');
var logger = express();

var default_port = myConfig.port();
var default_interface = myConfig.hostname();

// set up routers and middleware
logger.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = logger.listen(default_port, default_interface, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s',host,port);
});

