var zlib = require('zlib');

var input = new Buffer('');
  	zlib.gunzip(input, function(err, d) {
		if(err) {
  			throw err;
  		}
  		console.log(d.toString());
  	});