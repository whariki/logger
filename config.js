/*
config.js

gets the config from either the command line or the file logger.config or defaults
*/

var util = require('util');
var debuglog = util.debuglog('config');
var fs = require('fs');
var os = require('os');

// the defaults
// the port environment variable is used for Heroku deploment
var options = {
    hostname:'0.0.0.0',
    port:process.env.PORT || 50000,
    database:'localhost:27017'
};

var configFile = './logger.config'

// defintion of the options.
var help_text = "usage: nodejs logger.js [-p port_number] [-h hostname] [-d database connection string]\n\n"
var optionDef = {

    hostname: {
        shortname: "-h",
        name: "hostname",
        set: function(value) {
            if(value != undefined) {
                options.hostname = value;
            } else {
                console.error("Leaving hostname as %s", options.hostname);
            }
        }
    },

    port: {
        shortname: "-p",
        name: "port",
        set: function(value) {
            if(value != undefined) {
                var tmp = Number(value);
                debuglog("attempting to set port to %s",value)
                if(typeof tmp == 'number' && tmp > 0 && tmp <= 65535) {
                    options.port = tmp;
                } else {
                    console.error("Can't assign port number to %s, using %s",value, options.port);
                }
            } else {
                console.error("Leaving port number as %s", options.port)
            }
        }
    },

    database: {
        shortname: "-d",
        name: "database",
        set: function(value) {
            if(value != undefined) {
                options.database = value;
            } else {
                console.error("Leaving database as %s", options.database);
            }
        }
    }
}

var assign_option = function(lhs,rhs) {
    debuglog("attempting to assigning option %s = %s ",lhs,rhs);
    for(var key in optionDef) {
        if(optionDef[key].name == lhs || optionDef[key].shortname == lhs) {
            optionDef[key].set(rhs);
            return;
        }
    }
    console.error("Didn't recognise configuration option '%s' and value '%s'", lhs, rhs);
};

// exported getters
// hostname
exports.hostname = function() {
    return options.hostname;
};

// port
exports.port = function() {
    return options.port;
};

// database
exports.database = function() {
    return options.database;
}

// generic code to process options
var parse_config_file_option = function(str, callback) {
    /* callback = function(lhs, rhs)
    / where lhs is the left hand side of '=' and rhs is the right hand side of '='
    /
    / ignores comments and blank lines and produces error text on lines that don't have an =
    */
    debuglog("processing config file line '%s'",str)
    if (str.trim().length > 0) {
        if (str.trim().search(/^#/i) === -1) {
            var tmp = str.split("=");
            if (tmp.length > 1) {
                var rhs = '';
                for(var i = 1; i < tmp.length; i++) {
                    rhs = rhs + ' ' + tmp[i];
                };
                callback(tmp[0].trim(), rhs.trim());
            } else {
                console.error("Couldn't process configuration line '%s'",str);
            };
        };
    };
};

// opens config file for reading first, then command line args will override it
// attempt to read the file.
try {
    var configData = fs.readFileSync(configFile,{encoding:'utf8'}).split('\n');
} catch(err) {
    // ignore error, doesn't matter if file doesn't exist
    debuglog("Config file '%s' dosen't exist",configFile);
};

if (configData != undefined) {
    for (var i = 0; i < configData.length; i++) {
        parse_config_file_option(configData[i], assign_option);
    };
};

// parse command line arguments for reading.
var parse_argv = function(opt) {
    for(var i=2; i < process.argv.length; i=i+2) {

        // check that there is an argument value
        if (process.argv.length < i+1) {
            console.log(help_text);
            process.exit();
        };
        assign_option(process.argv[i],process.argv[i+1])
    };
};

parse_argv(options);

debuglog("after command line parse options are: %s",JSON.stringify(options));
