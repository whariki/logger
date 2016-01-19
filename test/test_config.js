var assert = require('assert');
var child_process = require('child_process');
var spawn = require('child_process').spawn;
//var fork = child_process.fork;
//var exec = child_process.exec;
var fs = require('fs');
var os = require('os');
var sleep = require('sleep');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var default_listen_host = '0.0.0.0';
var default_listen_port = '50000';

context('Test Suite: config.js unit tests: ', function() {

describe('Command Line Args Only', function() {
    var config_file_exists = true;

    this.slow(2000);
    this.timeout(20000);

    before(function() {
        // renames the logger.config to remove it from the test.

        // test for existence of logger.config
        var dir = {};
        var mv = {};

        try {
            os.type() === 'Windows_NT' ?
                dir = child_process.execSync('dir /B logger.config',{encoding:'utf8'}):
                dir = child_process.execSync('ls logger.config',{encoding:'utf8'});
            //console.log(dir);
        } catch(err) {
            config_file_exists = false;
        }

        if (config_file_exists) {
            os.type() === 'Windows_NT' ?
                mv = child_process.execSync('move logger.config test_config.logger.config',{encoding:'utf8'}):
                mv = child_process.execSync('mv -v logger.config test_config.logger.config',{encoding:'utf8'});
            //console.log(mv);
        }
        return 0;
    });

    after(function() {
        // replaces the logger.config
        var mv = {};

        if (config_file_exists) {
            os.type() === 'Windows_NT' ?
                mv = child_process.execSync('move test_config.logger.config logger.config',{encoding:'utf8'}):
                mv = child_process.execSync('mv -v test_config.logger.config logger.config',{encoding:'utf8'});
            //console.log(mv);
        }
        return 0;
    });

    describe('no command line arguments', function() {

        //var uut = fork('logger.js', [],{silent : true});
        var uut = spawn('node', ['logger.js'], {encoding:'utf8'});

        var uut_running = true;
        var test_timed_out = false;
        var test_error_reported = false;

        //console.log("logger process running as pid %s",uut.pid)

        //init_logger_process(uut, uut_running, test_timed_out);

        it('start logger.js', function (done) {
            var myTimeout = setTimeout(function() {
                uut.kill();
                uut_running = false;
                //console.log("pid %s timed out",uut.pid)
                test_timed_out = true;
            }, 10000);

            uut.on('exit', function(code, signal) {
                //console.log('exit event');
                uut_running = false;
            });

            uut.stdout.on('data', function (data) {
                console.log('got data: %s',data);
                assert.equal(`Logger app listening at http://${default_listen_host}:${default_listen_port}\n`,decoder.write(data));
                done();
                uut_running = false;
                uut.kill();
            });

            uut.stderr.on('data', function (data) {
                //console.log('error data: %s',data);
                test_error_reported = true; //decoder.write(data);
                done();
                uut.kill();
            });
            uut.stdin.end();
        });

        // wait for process to spawn and return
        it('should start with no errors', function () {
            for (var count = 0; count < 10; count ++) {
                if (!uut_running) {
                    count = 20000;
                }
                //console.log("waiting to get startup")
                sleep.sleep (1);// do nothing
            };
            assert.equal(false,test_timed_out);
            assert.equal(false,test_error_reported);
            uut.kill();
        });
    });


    describe(`command line specified hostname as an ip address`, function() {
        var hostnameUnderTest = '127.0.1.1';
        var uut = spawn('node', ['logger.js', '-h', `${hostnameUnderTest}`], {encoding:'utf8'});

        var uut_running = true;
        var test_timed_out = false;
        var test_error_reported = false;

        //init_logger_process(uut, uut_running, test_timed_out);

        //console.log("logger process running as pid %s",uut.pid)

        it(`start logger.js -h ${hostnameUnderTest}`, function (done) {
            var myTimeout = setTimeout(function() {
                uut.kill();
                uut_running = false;
                //console.log("pid %s timed out",uut.pid)
                test_timed_out = true;
            }, 10000);

            uut.on('exit', function(code, signal) {
                //console.log('exit event');
                uut_running = false;
            });

            uut.stdout.on('data', function (data) {
                console.log('got data: %s',data);
                assert.equal(`Logger app listening at http://${hostnameUnderTest}:${default_listen_port}\n`,decoder.write(data));
                done();
                uut_running = false;
                uut.kill();
            });

            uut.stderr.on('data', function (data) {
                //console.log('error data: %s',data);
                test_error_reported = true;
                done();
                uut.kill();
            });
            uut.stdin.end();
        });

        // wait for process to spawn and return
        it('should start with no errors', function () {
            for(var count = 0; (uut_running  && count < 10000/100); count++) {
                sleep.usleep(100);
                count++;
            };
            assert.equal(false,test_timed_out);
            assert.equal(false,test_error_reported);
            uut.kill();
        });
    });



    describe(`command line specified port`, function() {
        var portUnderTest = '6555';
        var uut = spawn('node', ['logger.js', '-p', `${portUnderTest}`], {encoding:'utf8'});

        var uut_running = true;
        var test_timed_out = false;
        var test_error_reported = false;

        //init_logger_process(uut, uut_running, test_timed_out);

        //console.log("logger process running as pid %s",uut.pid)

        it(`start logger.js -p ${portUnderTest}`, function (done) {
            var myTimeout = setTimeout(function() {
                uut.kill();
                uut_running = false;
                //console.log("pid %s timed out",uut.pid)
                test_timed_out = true;
            }, 10000);

            uut.on('exit', function(code, signal) {
                //console.log('exit event');
                uut_running = false;
            });

            uut.stdout.on('data', function (data) {
                console.log('got data: %s',data);
                assert.equal(`Logger app listening at http://${default_listen_host}:${portUnderTest}\n`,decoder.write(data));
                done();
                uut_running = false;
                uut.kill();
            });

            uut.stderr.on('data', function (data) {
                //console.log('error data: %s',data);
                test_error_reported = true;
                done();
                uut.kill();
            });
            uut.stdin.end();
        });

        // wait for process to spawn and return
        it('should start with no errors', function () {
            for(var count = 0; (uut_running  && count < 10000/100); count++) {
                sleep.usleep(100);
                count++;
            };
            assert.equal(false,test_timed_out);
            assert.equal(false,test_error_reported);
            uut.kill();
        });
    });



    describe(`command line specified port and host`, function() {
        var portUnderTest = '55555';
        var hostnameUnderTest = '127.1.0.1';
        var uut = spawn('node', ['logger.js', '-p', `${portUnderTest}`, '-h', `${hostnameUnderTest}`], {encoding:'utf8'});

        var uut_running = true;
        var test_timed_out = false;
        var test_error_reported = false;

        //init_logger_process(uut, uut_running, test_timed_out);

        //console.log("logger process running as pid %s",uut.pid)

        it(`start logger.js -p ${portUnderTest} -h ${hostnameUnderTest}`, function (done) {
            var myTimeout = setTimeout(function() {
                uut.kill();
                uut_running = false;
                //console.log("pid %s timed out",uut.pid)
                test_timed_out = true;
            }, 10000);

            uut.on('exit', function(code, signal) {
                //console.log('exit event');
                uut_running = false;
            });

            uut.stdout.on('data', function (data) {
                console.log('got data: %s',data);
                assert.equal(`Logger app listening at http://${hostnameUnderTest}:${portUnderTest}\n`,decoder.write(data));
                done();
                uut_running = false;
                uut.kill();
            });

            uut.stderr.on('data', function (data) {
                //console.log('error data: %s',data);
                test_error_reported = true;
                done();
                uut.kill();
            });
            uut.stdin.end();
        });

        // wait for process to spawn and return
        it('should start with no errors', function () {
            for(var count = 0; (uut_running  && count < 10000/100); count++) {
                sleep.usleep(100);
                count++;
            };
            assert.equal(false,test_timed_out);
            assert.equal(false,test_error_reported);
            uut.kill();
        });
    });
});

});
