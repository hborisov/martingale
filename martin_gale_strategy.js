var Connector = require('./connector');
var cn = new Connector({
	host: 'localhost',
	user: 'root',
	password: '@bcd!234',
	database: 'martingale'
});

var matches = [];
var constructed = {};
constructed.flag = false;

function MartinGaleStrategy() {
	cn.selectAllMatches(function(rows) {
		rows.forEach(function(element, index, array) {
			matches.push(element);
		});

		constructed.flag = true;
		console.log(matches.length);
	});

	console.log(matches.length);
	console.log(constructed.flag);

}

module.exports = MartinGaleStrategy;