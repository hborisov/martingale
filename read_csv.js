var fs = require('fs');
var readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('../test_data/E0.csv'),
    output: process.stdout,
    terminal: false
});



var mysql_connector = (function(){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '@bcd!234',
	  database : 'martingale'
	});

	connection.connect();

	connection.query('SELECT * from CSVData', function(err, rows, fields) {
	  if (err) {
	  	throw err;
	  }

	  for(i=0; i<rows.length; i++) {
	  	console.log(rows[i].DIVISION);
	  	console.log(rows[i].MATCH_DATE);
	  	console.log(rows[i].HOME_TEAM);
	  	console.log(rows[i].AWAY_TEAM);
	  	console.log(rows[i].FT_HOME_GOALS);
	  }
	  
	});

	connection.end();
}());

rd.on('line', function(line) {
	var csvValues = line.split(",");
	//div, date, home team, away team, final time home goals, final time away goals, final time result
    console.log("Division: " + csvValues[0]);
    console.log("Date: " + csvValues[1]);
    console.log("Home Team: " + csvValues[2]);
    console.log("Away Team: " + csvValues[3]);
    console.log("HT Goals: " + csvValues[4]);
    console.log("AT Goals: " + csvValues[5]);
    console.log("FT Goals: " + csvValues[6]);
    console.log("============================");
});