var http = require('http');
var Odds = require('./read_odds');
var async = require('async');

function Bet365Client(league) {
	this.cookies = {};
	this.cookies['cp2'] = 'cp2=0';
	this.leagueId = '';
	this.leagueIdCookie = '';
	this.leaguePath = '';
	this.cb = '';

	Bet365Client.chooseLeague.call(this, league);
	console.log(this);
	
	this.headers = {
		'Connection' : 'keep-alive',
		'Cache-Control' : 'max-age=0',
		'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'User-Agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
		'Accept-Language' : 'bg,en-GB;q=0.8,en;q=0.6',
		'Cookie' : 'cp2=0',
		'Host' : 'www.sportgiochi365.com'
		//'accept-encoding' : 'gzip,deflate,sdch',
	};

	this.options = {
		hostname: '192.168.1.110',//'www.sportgiochi365.com',//www.italiabet365.com','www.sportgiochi365.com'
		port: 8888,
		path: 'http://www.sportgiochi365.com/bg/',
		method: 'GET',
		headers: this.headers
	};
}

Bet365Client.prototype.getOdds = function(cb) {
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
		function (err, oddsResult) {
			cb(oddsResult);
		}
	);
};

Bet365Client.request1 = function(callback) {
	var self = this;

	Bet365Client.printHeaders(this.options);
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
	
	this.options.path = 'http://www.sportgiochi365.com/home/?lng=19';
	this.headers.Host = 'www.sportgiochi365.com';//'www.italiabet365.com';
	var cookies_concat = '';
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options);
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

	var base_host = 'http://www.sportgiochi365.com';//'http://www.italiabet365.com';
	var base = location.substr(base_host.length, location.length-1);
	
	this.cb = Bet365Client.extractCB(location);

	this.options.path = location;
	this.headers.Referer = 'http://www.sportgiochi365.com/bg/';//'http://www.italiabet365.com/bg/';
	var cookies_concat = '';
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options);
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

	this.options.path = 'http://www.sportgiochi365.com' + this.leaguePath;
	this.headers.Referer = 'http://www.sportgiochi365.com/home/FlashGen4/WebConsoleApp.asp?lng=19&cb=' + this.cb;
	cookies_concat = '';
	this.cookies['session'] = this.cookies['session'] + '&pscp=' + this.leagueIdCookie;
	for(var cks in this.cookies) {
		cookies_concat += this.cookies[cks] + '; ';
	}
	this.headers.cookie = cookies_concat;

	Bet365Client.printHeaders(this.options);
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
		readOdds.get(function(oddsResult) {
			callback(null, oddsResult);
		});
	});
};

Bet365Client.extractCB = function(location) {
	var locationParts = location.split('?');
	var queryParameters = locationParts[1].split('&');
	for (var i=0; i<queryParameters.length; i++) {
		var param = queryParameters[i].split('=');
		if (param[0] === 'cb') {
			return param[1];
		}
	}
};

Bet365Client.chooseLeague = function(leagueName) {
	var leage_number;
	
	if (leagueName === 'premier_league') {
		league_number = '24953825';
	} else if (leagueName === 'second_bundes_league') {
		league_number = '24964290';
	} else if (leagueName === 'serie_b') {
		league_number = '25075965';
	}

	this.leagueId = encodeURIComponent('#AC#B1#C1#D13#E{leagueid}#F2#F^1#'.replace('{leagueid}', league_number));
	this.leagueIdCookie = encodeURIComponent('#AC#B1#C1#D13#E{leagueid}#F2#R1#'.replace('{leagueid}', league_number));
	this.leaguePath = '/home/inplayapi/FlashData.asp?lid=19&zid=0&pd='+ this.leagueId +'&wg=0&cid=31&cg=0';
};

module.exports = Bet365Client;