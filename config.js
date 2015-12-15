/*
config.js

gets the config from either the command line or the file logger.config or defaults
*/

//var util = require('util'); 
//var debuglog = util.debuglog('config');

// the defaults
var options = {
    hostname:'127.0.0.1',
    port:50000,
    database:''
};

// command line options
var port_option = "-p"
var hostname_option = "-h"
var database_option = "-d"

var help_text = "usage: nodejs logger.js [-p port_number] [-h hostname] [-d database connection string]\n\n"

// parse command line arguments for reading.
function parse_argv(opt) {
    for(var i=0; i < process.argv.length; i=i+2) {
        switch(process.argv[i]) {
            case 'node':
                break;
            case port_option:
                var tmp = Number(process.argv[i+1]);
                if(tmp == NaN) {
                    console.log(help_text);
                    process.exit();
                } else {
                    opt.port = tmp;
                };
                break;
            //<TODO: hostname and other options>
            default:
                console.log(help_text);
                process.exit();
                break;
        };
    };
};

parse_argv(options);

//debuglog("after command line parse options are: %s",JSON.stringify(options));
               
// <TODO: open config file for reading>

// hostname
exports.hostname = function() {
    return options.hostname;
};

// port
exports.port = function() {
    return options.port;
};


