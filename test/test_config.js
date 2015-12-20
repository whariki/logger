var assert = require('assert');
var child_process = require('child_process');
var spawn = require('child_process').spawn;
//var fork = child_process.fork;
//var exec = child_process.exec;
var fs = require('fs');
var os = require('os');
var sleep = require('sleep');

var default_listen_host = '127.0.0.1';
var default_listen_port = '50000';

context('Test Suite: config.js unit tests: ', function() {

describe('Command Line Args Only', function() {
    var config_file_exists = true;

    this.slow(10000);

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

    describe('start up with no command line arguments', function() {
        var uut = spawn('node', ['logger.js'], {encoding:'utf8', detacted: true});
        var uut_running = true;
        var test_timed_out = false;


        console.log("logger process running as pid %s",uut.pid)

        it('setup test 1', function () {
            var myTimeout = setTimeout(function() {
                uut.kill();
                uut_running = false;
                console.log("pid %s timed out",uut.pid)
                test_timed_out = true;
            }, 10000)

            uut.on('exit', function(code, signal) {
                console.log('exit event');
                uut_running = false;
            });

            uut.stdout.on('data', function (data) {
                console.log('got data: %s',data);
                assert.equal(('Logger listening at http://%s:%s',default_listen_host,default_listen_port),data);
                done();
                uut.kill();
            });

            uut.stderr.on('data', function (data) {
                console.log('error data: %s',data);
                asset.equal(1,0);
                done();
                uut.kill();
            });
            uut.stdin.end()
        });
    //});

    // wait for process to spawn and return
    //it('should exit correctly', function () {
        it('should start with no errors if no command line args', function (done) {
            for (var count = 0; count < 10; count ++) {
                if (!uut_running) {
                    count = 20;
                }
                console.log("waiting to get startup")
                sleep.sleep (1);// do nothing
            };
            assert.equal(false,test_timed_out);
            uut.kill();
            done();
        });
    });

    it('should start with command line specified hostname as an ip address', function () {
        var uut = spawn('node', ['logger.js', '-h 127.0.1.1'], {encoding:'utf8'});
        var uut_running = true;

        console.log("logger process running as pid %s",uut.pid)

        uut.on('exit', function(code, signal) {
            uut_running = false;
        });

        uut.stdout.on('data', function(data) {
            asset.equal(('Logger listening at http://127.0.0.1:%s',default_listen_port),data);
            console.log('exiting logger');
            uut.kill('SIGTERM');
        });

        uut.stderr.on('data', function (data) {
            asset.equal(1,0);
            uut.kill('SIGTERM');
        });

        // wait for process to spawn and return
        it('should exit correctly', function () {
            for(var count = 0; (uut_running  && count < 10000/100); count++) {
                sleep.usleep(100);
                count++;
            };
            asset.equal(false,uut_running);
            uut.kill('SIGTERM');
        });
    });
});


});
