var Connector = require('./connector');
var moment = require('moment');

function Bet() {
	this.cn = new Connector({
		host: 'localhost',
		user: 'root',
		password: '@bcd!234',
		database: 'martingale'
	});
}

Bet.prototype.readBets = function(cb) {
	this.cn.selectAllBets(cb);
};

Bet.prototype.readPendingBets = function(cb) {
	this.cn.selectAllPendingBets(cb);
};

Bet.prototype.placeBet = function(fixtureId, amount, odd, team, bet, cb) {
	this.cn.insertBet(fixtureId, amount, odd, team, bet, moment().format('YYYY-MM-DD'), cb);
};

Bet.prototype.updateBet = function(betId, result, cb) {
	this.cn.updateBet(betId, result, cb);
};

module.exports = Bet;