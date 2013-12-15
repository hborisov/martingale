var fs = require('fs');
var readline = require('readline');
var http = require('http');
var Connector = require('./connector');

var cn = new Connector({
	host: 'localhost',
	user: 'root',
	password: '@bcd!234',
	database: 'martingale'
});

var counter = {};
counter.val = 0;

var rd1 = readline.createInterface({
    input: fs.createReadStream('./../test_data/match_data.txt'),
    output: process.stdout,
    terminal: false
});

rd1.on('line', function(line) {
    var request = http.get(line, function(response) {

		var rd = readline.createInterface({
		    input: response,
		    output: process.stdout,
		    terminal: false
		});

		console.log("DIVISION   |   DATA   |   HOME TEAM   |   AWAY TEAM   |   HT GOALS   |   AT AWAY   |   FT RESULT");
		rd.on('line', function(line) {
			var csvValues = line.split(",");

		    console.log(csvValues[0] + '   ' + 
		    			csvValues[1] + '   ' +
		    			csvValues[2] + '   ' +
		    			csvValues[3] + '   ' +
		    			csvValues[4] + '   ' +
		    			csvValues[5] + '   ' +
		    			csvValues[6]);

		//TODO: check for heading line and for empty columns which denotes a match that hasn't finished.
			if(csvValues[0] !== 'Div' && csvValues[0] !== '') {

			    var input = {};
				input.DIVISION = csvValues[0];
				input.MATCH_DATE = csvValues[1];
				input.HOME_TEAM = csvValues[2];
				input.AWAY_TEAM = csvValues[3];
				input.FT_HOME_GOALS = csvValues[4];
				input.FT_AWAY_GOALS = csvValues[5];
				input.FT_RESULT = csvValues[6];
			    
			    counter.val += 1;
			    cn.insertIfMatchNotExistsWithCallback(input, function(cnt) {
			    	cnt.val -= 1;
			    	//console.log(cnt.val);
			    	if(cnt.val === 0) {
			    		process.exit();
			    	}

			    }, counter);
			}
		});
	});
});



