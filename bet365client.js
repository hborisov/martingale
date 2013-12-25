var http = require('http');
var Odds = require('./read_odds');
var async = require('async');

function Bet365Client() {
	this.serieB_path = '/home/inplayapi/FlashData.asp?lid=19&zid=0&pd=%23AC%23B1%23C1%23D13%23E25075965%23F2%23F%5E1%23&wg=0&cid=31&cg=0';
	this.cookies = {};
	this.cookies['cp2'] = 'cp2=0';
	
	this.headers = {
		'connection' : 'keep-alive',
		'cache-control' : 'max-age=0',
		'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
		'accept-language' : 'bg,en-GB;q=0.8,en;q=0.6',
		'cookie' : 'cp2=0',
		//'accept-encoding' : 'gzip,deflate,sdch',
	};

	this.options = {
		hostname: 'www.italiabet365.com',
		port: 80,
		path: '/bg/',
		method: 'GET',
		headers: this.headers
	};
}

Bet365Client.prototype.getOdds = function() {
	var self = this;
	async.waterfall(
		[
			function(callback) {
				Bet365Client.request1.call(self, callback);
			},
			function(callback) {
				Bet365Client.request2.call(self, callback);
			},
			function(location, callback) {
				Bet365Client.request3.call(self, location, callback);
			},
			function(callback) {
				Bet365Client.request4.call(self, callback);
			}
		],
		function (err, caption) {
			console.log("Finito La Comedia!");
			process.exit();
		}
	);
};

Bet365Client.request1 = function(callback) {
	var self = this;

	Bet365Client.printHeaders(this.options.headers);
	var req = http.request(this.options, function(res) {
		console.log('');
		console.log('Begin Response');
		console.log('STATUS: ' + res.statusCode);
		Bet365Client.printHeaders(res.headers);
		Bet365Client.updateCookies.call(self, res);

		callback(null);
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.end();
};

Bet365Client.request2 = function(callback) {
	var self = this;
	
	this.options.path = '/home/?lng=19';
	this.headers.host = 'www.italiabet365.com';
	var cookies_concat = '';
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options.headers);
	var req = http.request(this.options, function(res) {
		console.log('');
		console.log('Begin Response');
		console.log('STATUS: ' + res.statusCode);
		Bet365Client.printHeaders(res.headers);
		Bet365Client.updateCookies.call(self, res);

		callback(null, res.headers.location);
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.end();
};

Bet365Client.request3 = function(location, callback) {
	var self = this;

	var base_host = 'http://www.italiabet365.com';
	var base = location.substr(base_host.length, location.length-1);
	this.options.path = base;
	this.headers.referer = 'http://www.italiabet365.com/bg/';
	var cookies_concat = '';
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options.headers);
	var req = http.request(this.options, function(res) {
		console.log('');
		console.log('Begin Response');
		console.log('STATUS: ' + res.statusCode);
		Bet365Client.printHeaders(res.headers);
		Bet365Client.updateCookies.call(self, res);

		callback(null);
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.end();
};

Bet365Client.request4 = function(callback) {
	var self = this;

	this.options.path = this.serieB_path;
	this.headers.referer = 'http://www.italiabet365.com/home/FlashGen4/WebConsoleApp.asp?lng=19&cb=10881727156';
	cookies_concat = '';
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options.headers);
	var req = http.request(this.options, function(res) {
		console.log('');
		console.log('Begin Response');
		console.log('STATUS: ' + res.statusCode);
		Bet365Client.printHeaders(res.headers);
		if (res.headers['set-cookie'] !== undefined) {
			Bet365Client.updateCookies.call(self, res);
		}

		Bet365Client.printResponse(res, callback);
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.end();
};

Bet365Client.updateCookies = function(res) {
	for (var i=0; i<res.headers['set-cookie'].length; i++) {
		var cookie = res.headers['set-cookie'][i].split(';');
		this.cookies[cookie[0].split('=')[0]] = cookie[0];
	}
};

Bet365Client.printHeaders = function(headers) {
	console.log('Begin Headers.');
	console.log('--------------');
	for(var header in headers) {
		console.log(header + ' : ' + headers[header]);
	}
	console.log('--------------');
};

Bet365Client.printResponse = function(res, callback) {
	res.setEncoding('utf8');
	var gzipped_data = [];
	res.on('data', function (chunk) {
		gzipped_data.push(new Buffer(chunk));
	});

	res.on('end', function() {
		var buffer = Buffer.concat(gzipped_data);
		var readOdds = new Odds(buffer.toString());
		readOdds.print();

		callback(null);
	});
};

module.exports = Bet365Client;