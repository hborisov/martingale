var Connector = require('./connector');

var cn = new Connector({
	host: 'localhost',
	user: 'root',
	password: '@bcd!234',
	database: 'martingale'
});

var input = {};
input.DIVISION = 'E4';
input.MATCH_DATE = '2013-12-04';
input.HOME_TEAM = 'West Brom';
input.AWAY_TEAM = 'Manchester United';
input.FT_HOME_GOALS = '2';
input.FT_AWAY_GOALS = '3';
input.FT_RESULT = 'A';

cn.insertIfMatchNotExists2(input, function(err, rows, fields) {
	if (err) {
			throw err;
		}

	console.log('ASs'); 
});