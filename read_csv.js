var fs = require('fs');
var readline = require('readline');
var http = require('http');
var ms = require('./mysql_connector')();

var request = http.get("http://www.football-data.co.uk/mmz4281/1213/E0.csv", function(response) {

	var rd = readline.createInterface({
	    input: response,
	    output: process.stdout,
	    terminal: false
	});

	rd.on('line', function(line) {
		var csvValues = line.split(",");

	    console.log("Division: " + csvValues[0]);
	    console.log("Date: " + csvValues[1]);
	    console.log("Home Team: " + csvValues[2]);
	    console.log("Away Team: " + csvValues[3]);
	    console.log("HT Goals: " + csvValues[4]);
	    console.log("AT Goals: " + csvValues[5]);
	    console.log("FT Result: " + csvValues[6]);
	    console.log("============================");

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


		    
		    ms.insertIfNotExists(input, function(err, rows, fields) {
		    	if(err) {
		    		throw err;
		    	}
		    });
		}
	});
});

