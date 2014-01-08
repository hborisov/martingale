var fs = require('fs');
var readline = require('readline');
var http = require('http');
var Connector = require('./connector');
var moment = require('moment');

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

function convertTeam(team) {
	if (team === 'HULL') {
		return 'HULL CITY';
	} else if (team === 'STOKE') {
		return 'STOKE CITY';
	} else if (team === 'MAN UNITED') {
		return 'MANCHESTER UTD';
	} else if (team === 'MAN CITY') {
		return 'MANCHESTER CITY';
	}
	
	return team;
}

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
						moment(csvValues[1], 'DD/MM/YY').format("YYYY-MM-DD") + '   ' +
						csvValues[2] + '   ' +
						csvValues[3] + '   ' +
						csvValues[4] + '   ' +
						csvValues[5] + '   ' +
						csvValues[6]);

		//TODO: check for heading line and for empty columns which denotes a match that hasn't finished.
			if(csvValues[0] !== 'Div' && csvValues[0] !== '') {

				var input = {};
				input.DIVISION = csvValues[0];

				if (csvValues[1].length === 8) {
					input.MATCH_DATE = moment(csvValues[1], 'DD/MM/YY').format("YYYY-MM-DD");
				} else if (csvValues[1].length === 10) {
					input.MATCH_DATE = moment(csvValues[1], 'DD/MM/YYYY').format("YYYY-MM-DD");
				}
				
				input.HOME_TEAM = convertTeam(csvValues[2].toUpperCase());
				input.AWAY_TEAM = convertTeam(csvValues[3].toUpperCase());
				input.FT_HOME_GOALS = csvValues[4];
				input.FT_AWAY_GOALS = csvValues[5];
				input.FT_RESULT = csvValues[6];
				input.STATUS = 'Fin';

				counter.val += 1;
				cn.insertUpdate(input, function(cnt) {
					cnt.val -= 1;
					if(cnt.val === 0) {
						process.exit();
					}
				}, counter);
			}
		});
	});
});