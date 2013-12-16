var Connector = require('./connector');

function MartinGaleStrategy() {
	this.matches = [];
	this.constructed = {};
	this.constructed.flag = false;
	this.connection = new Connector({
		host: 'localhost',
		user: 'root',
		password: '@bcd!234',
		database: 'martingale'
	});

	this.connection.selectAllMatches((function(rows) {
		rows.forEach((function(element, index, array) {
			this.matches.push(element);
		}).bind(this));

		this.constructed.flag = true;
		console.log('a ' + this.matches.length);
	}).bind(this));

	console.log(this.matches.length);
	console.log(this.constructed.flag);

}

MartinGaleStrategy.prototype.getMatchesWithoutDraw = function() {

};

MartinGaleStrategy.prototype.len = function() {
	console.log(this.matches.length);
	console.log(this.constructed.flag);
};

module.exports = MartinGaleStrategy;