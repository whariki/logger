var assert = require('assert');
var http = require('http');

describe('Array',function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is no present', function() {
			assert.equal(-1, [1,2,3].indexOf(5));
			assert.equal(-1, [1,2,3].indexOf(0));
			assert.equal(-1, [1,2,3].indexOf(4));
		});
	});
});

describe('Hello World', function() {
    describe('/', function() {
        it('should return "Hello World!" if the server is running', function(done) {
            var request = { hostname: 'localhost', port: 3000, path: '/', agent: false };
            http.get(request, function (res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    assert.equal('Hello World!',chunk);
                    done();
                });
            });
        });
    });
    describe('unknown route', function() {
        it('should return "could not find route" if the server is running', function(done) {
            var request = { hostname: 'localhost', port: 3000, path: '/unknown', agent: false };
            http.get(request, function (res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    assert.equal('Cannot GET /unknown\n',chunk);
                    done();
                });
            });
        });
    });
});
