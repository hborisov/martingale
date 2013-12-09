var fs = require('fs');
var readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('../test_data/E0.csv'),
    output: process.stdout,
    terminal: false
});


rd.on('line', function(line) {
	var csvValues = line.split(",");
	//div, date, home team, away team, final time home goals, final time away goals, final time result
    console.log("Division: " + csvValues[0]);
    console.log("Date: " + csvValues[1]);
    console.log("Home Team: " + csvValues[2]);
    console.log("Away Team: " + csvValues[3]);
    console.log("HT Goals: " + csvValues[4]);
    console.log("AT Goals: " + csvValues[5]);
    console.log("FT Result: " + csvValues[6]);
    console.log("============================");

	if(csvValues[0] !== 'Div') {

	    var input = {};
		input.DIVISION = csvValues[0];
		input.MATCH_DATE = csvValues[1];
		input.HOME_TEAM = csvValues[2];
		input.AWAY_TEAM = csvValues[3];
		input.FT_HOME_GOALS = csvValues[4];
		input.FT_AWAY_GOALS = csvValues[5];
		input.FT_RESULT = csvValues[6];


	    var ms = require('./mysql_connector')();
	    ms.insertIfNotExists(input, function(err, rows, fields) {
	    	if(err) {
	    		throw err;
	    	}
	    });
	}

});