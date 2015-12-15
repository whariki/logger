var express = require('express');
var logger = express();

logger.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = logger.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://&s:%s',host,port);
});

