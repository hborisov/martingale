var http = require('http');
var zlib = require('zlib');

var cookies = {};
cookies['cp2'] = 'cp2=0';
var serieB_path = '/home/inplayapi/FlashData.asp?lid=19&zid=0&pd=%23AC%23B1%23C1%23D13%23E25075965%23F2%23F%5E1%23&wg=0&cid=31&cg=0';

var headers = {
	'connection' : 'keep-alive',
	'cache-control' : 'max-age=0',
	'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'user-agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
	//'accept-encoding' : 'gzip,deflate,sdch',
	'accept-language' : 'bg,en-GB;q=0.8,en;q=0.6',
	'cookie' : 'cp2=0'
};

var options = {
  hostname: 'www.italiabet365.com',
  port: 80,
  path: '/bg/',
  method: 'GET',
  headers: headers
};


var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  console.log(res.headers['set-cookie'].length);

  for (var i=0; i<res.headers['set-cookie'].length; i++) {
	var cookie = res.headers['set-cookie'][i].split(';');
		cookies[cookie[0].split('=')[0]] = cookie[0];
  }

  options.path = '/home/?lng=19';
  headers.host = 'www.italiabet365.com';
  var cookies_concat = '';
	for(var cks in cookies) {
		cookies_concat += cookies[cks] + '; ';
	}
	console.log(cookies_concat);
  headers.cookie = cookies_concat;
  console.log('--------------------------------');
  console.log(options);
  console.log('--------------------------------');
  var req2 = http.request(options, function(res) {
  	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  console.log(res.headers['set-cookie'].length);

	  for (var i=0; i<res.headers['set-cookie'].length; i++) {
		var cookie = res.headers['set-cookie'][i].split(';');
			cookies[cookie[0].split('=')[0]] = cookie[0];
	  }

	  console.log(res.headers.location);
	  var base_host = 'http://www.italiabet365.com';
	  var base = res.headers.location.substr(base_host.length, res.headers.location.length-1);
	  console.log(base);
	  options.path = base;
	  headers.referer = 'http://www.italiabet365.com/bg/';
	  	cookies_concat = '';
		for(var cks in cookies) {
			cookies_concat += cookies[cks] + '; ';
		}
		console.log(cookies_concat);
		headers.cookie = cookies_concat;


		var req3 = http.request(options, function(res) {
			console.log('STATUS: ' + res.statusCode);
	  		console.log('HEADERS: ' + JSON.stringify(res.headers));
	  		for (var i=0; i<res.headers['set-cookie'].length; i++) {
			var cookie = res.headers['set-cookie'][i].split(';');
				cookies[cookie[0].split('=')[0]] = cookie[0];
	  		}

	  		console.log(cookies);

	  		options.path = serieB_path;
	  		headers.referer = 'http://www.italiabet365.com/home/FlashGen4/WebConsoleApp.asp?lng=19&cb=10881727156';
	  		cookies_concat = '';
			for(var cks in cookies) {
				cookies_concat += cookies[cks] + '; ';
			}
			console.log(cookies_concat);
			headers.cookie = cookies_concat;
	  		var req4 = http.request(options, function(res) {
				console.log('STATUS: ' + res.statusCode);
		  		console.log('HEADERS: ' + JSON.stringify(res.headers));
		  		/*for (var i=0; i<res.headers['set-cookie'].length; i++) {
				var cookie = res.headers['set-cookie'][i].split(';');
					cookies[cookie[0].split('=')[0]] = cookie[0];
		  		}

		  		console.log(cookies);*/

		  		res.setEncoding('utf8');
		  		var gzipped_data = [];
				  res.on('data', function (chunk) {
				    console.log('BODY: ' );
				    //chunk.pipe(zlib.createGunzip()).pipe(process.stdout);
				    
				    gzipped_data.push(new Buffer(chunk));
				  });
				  res.on('end', function() {
				  	console.log('response sent');
				  	var buffer = Buffer.concat(gzipped_data);
				  	console.log('response sent len: ' + buffer.length);
				  	console.log(buffer.toString());
				  	/*zlib.gunzip(buffer, function(err, decoded) {
				  		if(err) {
				  			console.log(err);
				  			return;
				  		}
				  		console.log('unzipping');
				  		console.log(decoded.toString());
				  	});
				  	
				  	console.log(typeof gzipped_data);*/
				  	//var gunzip = zlib.createGunzip();
				  	/*var input = new Buffer(gzipped_data);
				  	zlib.gunzip(input, function(err, d) {
				  		if(err) {
				  			throw err;
				  		}
				  		console.log(d.toString());
				  	});*/

					/*  chunk.pipe(gunzip);
					  gunzip.on('data', function() {
					    console.log(data);
					  });
*/
				  	/*var buffer = new Buffer(gzipped_data);
				  	console.log(buffer);
				  	console.log(zlib);
					zlib.gunzip(buffer, function(err, buf) {
					  if (!err) {
					    console.log(buf.toString());
					  }
					  console.log(buf);
					});*/

				  	//var stream = new Stream();

				  	//console.log(gzipped_data);
				  	//raw.pipe(zlib.createGunzip()).pipe(process.stdout);
				  });
	  		});
	  		req4.end();
		});
		req3.end();
  });
  req2.end();
	/*console.log(cookies);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    //console.log('BODY: ' + chunk);
  });*/
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();