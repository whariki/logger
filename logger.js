var myConfig = require('./config.js');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var middleware = require('./app/middleware');
var routes = require('./app/routes');
var logger = express();

logger.listening_port = myConfig.port();
logger.listening_interface = myConfig.hostname();
logger.database_string = myConfig.database();

// connect to database
mongoose.connect('mongodb://' + logger.database_string, function (error) {
    if (error) {
        console.log(`Couldn\'t connect to database using connection string ${logger.database_string}`);
        throw error;
    }
});

// set up routers and middleware
middleware(logger);
routes(logger);

// for when mounting as a sub app
logger.on('mount', function (parent) {
  console.log('Admin Mounted');
  console.log(parent); // refers to the parent app
});

var server = http.createServer(logger).listen(logger.listening_port, logger.listening_interface, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Logger app listening at http://%s:%s',host,port);
});

/* example https setup
var https = require('https');
var fs = require('fs');

var default_https_port = process.env.PORT || 443;

const https_options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

var https_server = https.createServer(https_options,logger).listen(default_https_port, default_interface, function () {
    var host = https_server.address().address;
    var port = https_server.address().port;

    console.log('Logger app listening at http://%s:%s',host,port);
});
*/
