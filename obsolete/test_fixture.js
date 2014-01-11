var moment = require('moment');
var F = require('./fixture');
var fixtures = new F();

var input = {};
input.DIVISION = 'PR';
input.MATCH_DATE = moment('2014-01-03', 'YYYY-MM-DD').format("YYYY-MM-DD");
input.HOME_TEAM = 'Loko';
input.AWAY_TEAM = 'Levski';
//var goals = fixtures[i].fixtures[j][11].split('-');
input.FT_HOME_GOALS = '-1';
input.FT_AWAY_GOALS = '-1';
input.FT_RESULT = 'x';
input.STATUS = 'Sched';

fixtures.addUpdateFixture(input, 0, function(cnt) {
	console.log(cnt);
	process.exit();
});