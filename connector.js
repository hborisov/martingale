var mysql = require('mysql');
//var async = require('async');
var sync = require('sync');

var SELECT_MATCH_STATEMENT = "SELECT * FROM CSVData WHERE DIVISION = %1 AND MATCH_DATE = %2 AND HOME_TEAM = %3 AND AWAY_TEAM = %4";
var SELECT_MATCH_BYID_STATEMENT = "SELECT * FROM CSVData WHERE ID = %1";
var SELECT_TEAM_MATCHES_AFTER_DATE_STATEMENT  = "SELECT * FROM CSVData WHERE MATCH_DATE > %1 AND (HOME_TEAM = %2 OR AWAY_TEAM = %2) ORDER BY MATCH_DATE ASC";
var INSERT_MATCH_STATEMENT = "INSERT INTO CSVData (DIVISION, MATCH_DATE, HOME_TEAM, AWAY_TEAM, FT_HOME_GOALS, FT_AWAY_GOALS, FT_RESULT, STATUS) VALUES (%1, %2, %3, %4, %5, %6, %7, %8)";
var UPDATE_MATCH_STATEMENT = "UPDATE CSVData SET FT_HOME_GOALS = %1, FT_AWAY_GOALS = %2, FT_RESULT = %3, STATUS = %4 WHERE DIVISION = %5 AND MATCH_DATE = %6 AND HOME_TEAM = %7 AND AWAY_TEAM = %8";
var SELECT_ALL_MATCHES = "SELECT * FROM CSVData WHERE MATCH_DATE > '2013-08-01' ORDER BY MATCH_DATE DESC";
var INSERT_BET_STATEMENT = "INSERT INTO bet (FIXTURE_ID, AMOUNT, ODD, TEAM, BET, DATE, RESULT) VALUES ( %1, %2, %3, %4, %5, %6, %7)";
var UPDATE_BET_STATEMENT = "UPDATE bet SET RESULT = %1 WHERE ID = %2";
var SELECT_ALL_BETS = "SELECT * FROM BET";
var SELECT_ALL_PENDING_BETS = "SELECT * FROM BET WHERE RESULT = 'PENDING'";


function MysqlConnector(options) {
	this.connection = mysql.createConnection(options);
}

MysqlConnector.prototype.checkIfMatchExists = function(matchData, cb) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);
   
    this.connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
		if (err) {
			throw err;
		}

		return (rows.length > 0) ? true : false;
	});
};

MysqlConnector.prototype.insertNewMatch = function(matchData, cb) {
	var insertMatchQuery = require('./query')(INSERT_MATCH_STATEMENT);
	insertMatchQuery.setParameter('1', matchData.DIVISION);
	insertMatchQuery.setParameter('2', matchData.MATCH_DATE);
	insertMatchQuery.setParameter('3', matchData.HOME_TEAM);
	insertMatchQuery.setParameter('4', matchData.AWAY_TEAM);
	insertMatchQuery.setParameter('5', matchData.FT_HOME_GOALS);
	insertMatchQuery.setParameter('6', matchData.FT_AWAY_GOALS);
	insertMatchQuery.setParameter('7', matchData.FT_RESULT);
	insertMatchQuery.setParameter('8', matchData.STATUS);
	
	this.connection.query(insertMatchQuery.getQuery(), cb);
};

MysqlConnector.prototype.insertIfMatchNotExistsWithCallback = function(matchData, cb, cnt) {
	var self = this;

	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);

    this.connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
		if (err) {
			throw err;
		}

		if(rows.length === 0) {
			var insertMatchQuery = require('./query')(INSERT_MATCH_STATEMENT);
			insertMatchQuery.setParameter('1', matchData.DIVISION);
			insertMatchQuery.setParameter('2', matchData.MATCH_DATE);
			insertMatchQuery.setParameter('3', matchData.HOME_TEAM);
			insertMatchQuery.setParameter('4', matchData.AWAY_TEAM);
			insertMatchQuery.setParameter('5', matchData.FT_HOME_GOALS);
			insertMatchQuery.setParameter('6', matchData.FT_AWAY_GOALS);
			insertMatchQuery.setParameter('7', matchData.FT_RESULT);
			insertMatchQuery.setParameter('8', matchData.STATUS);

			self.connection.query(insertMatchQuery.getQuery(), function(err, rows, fields) {
				if (err) {
					throw err;
				}

				cb(cnt);
			});
		} else {
			cb(cnt);
		}
	});
};

MysqlConnector.prototype.insertUpdate = function(matchData, cb, cnt) {
	var self = this;

	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);

    this.connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
		if (err) {
			throw err;
		}

		if(rows.length === 0) {
			var insertMatchQuery = require('./query')(INSERT_MATCH_STATEMENT);
			insertMatchQuery.setParameter('1', matchData.DIVISION);
			insertMatchQuery.setParameter('2', matchData.MATCH_DATE);
			insertMatchQuery.setParameter('3', matchData.HOME_TEAM);
			insertMatchQuery.setParameter('4', matchData.AWAY_TEAM);
			insertMatchQuery.setParameter('5', matchData.FT_HOME_GOALS);
			insertMatchQuery.setParameter('6', matchData.FT_AWAY_GOALS);
			insertMatchQuery.setParameter('7', matchData.FT_RESULT);
			insertMatchQuery.setParameter('8', matchData.STATUS);

			self.connection.query(insertMatchQuery.getQuery(), function(err, rows, fields) {
				if (err) {
					throw err;
				}

				cb(cnt);
			});
		} else {
			var updateMatchQuery = require('./query')(UPDATE_MATCH_STATEMENT);
			updateMatchQuery.setParameter('1', matchData.FT_HOME_GOALS);
			updateMatchQuery.setParameter('2', matchData.FT_AWAY_GOALS);
			updateMatchQuery.setParameter('3', matchData.FT_RESULT);
			updateMatchQuery.setParameter('4', matchData.STATUS);
			updateMatchQuery.setParameter('5', matchData.DIVISION);
			updateMatchQuery.setParameter('6', matchData.MATCH_DATE);
			updateMatchQuery.setParameter('7', matchData.HOME_TEAM);
			updateMatchQuery.setParameter('8', matchData.AWAY_TEAM);

			self.connection.query(updateMatchQuery.getQuery(), function(err, rows, fields) {
				if (err) {
					throw err;
				}

				cb(cnt);
			});

		}
	});
};

MysqlConnector.prototype.selectAllMatches = function(cb) {
	var selectAllMatchesQuery = require('./query')(SELECT_ALL_MATCHES);
	this.connection.query(selectAllMatchesQuery.getQuery(), function(err, rows, fields) {
		if(err) {
			throw err;
		}

		cb(rows);
	});
};

MysqlConnector.prototype.selectMatchById = function(matchId, cb) {
	var selectMatchByIdQuery = require('./query')(SELECT_MATCH_BYID_STATEMENT);
		selectMatchByIdQuery.setParameter('1', matchId);

	this.connection.query(selectMatchByIdQuery.getQuery(), function(err, rows, fields) {
		if(err) {
			throw err;
		}

		cb(rows);
	});
};

MysqlConnector.prototype.selectNextTeamMatch = function(team, date, cb) {
	var selectTeamMatchesAfterDateQuery = require('./query')(SELECT_TEAM_MATCHES_AFTER_DATE_STATEMENT);
	console.log(date);
		selectTeamMatchesAfterDateQuery.setParameter('1', date);
		selectTeamMatchesAfterDateQuery.setParameter('2', team);

	this.connection.query(selectTeamMatchesAfterDateQuery.getQuery(), function(err, rows, fields) {
		if(err) {
			throw err;
		}

		cb(rows[0]);
	});
};

MysqlConnector.prototype.selectNextTeamMatchSync = function(team, date) {
	var selectTeamMatchesAfterDateQuery = require('./query')(SELECT_TEAM_MATCHES_AFTER_DATE_STATEMENT);
	console.log(date);
		selectTeamMatchesAfterDateQuery.setParameter('1', date);
		selectTeamMatchesAfterDateQuery.setParameter('2', team);
	
	//var result;
	var self = this;
	sync(function(){
		console.log(selectTeamMatchesAfterDateQuery.getQuery());
		var result = self.connection.query.sync(self, selectTeamMatchesAfterDateQuery.getQuery());
		console.log(result);
	});
	
	//console.log(result);
	//return result;
	/*this.connection.query(selectTeamMatchesAfterDateQuery.getQuery(), function(err, rows, fields) {
		if(err) {
			throw err;
		}

		cb(rows[0]);
	});*/
};

MysqlConnector.prototype.insertBet = function(fixtureId, amount, odd, team, bet, date, cb) {
	var insertBetQuery = require('./query')(INSERT_BET_STATEMENT);
		insertBetQuery.setParameter('1', fixtureId);
		insertBetQuery.setParameter('2', amount);
		insertBetQuery.setParameter('3', odd);
		insertBetQuery.setParameter('4', team);
		insertBetQuery.setParameter('5', bet);
		insertBetQuery.setParameter('6', date);
		insertBetQuery.setParameter('7', 'PENDING');

		this.connection.query(insertBetQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb();
		});
};

MysqlConnector.prototype.updateBet = function(betId, result, cb) {
	var updateBetQuery = require('./query')(UPDATE_BET_STATEMENT);
		updateBetQuery.setParameter('1', result);
		updateBetQuery.setParameter('2', betId);

		this.connection.query(updateBetQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows.changedRows);
		});
};

MysqlConnector.prototype.selectAllBets = function(cb) {
	var selectBetsQuery = require('./query')(SELECT_ALL_BETS);
		
	this.connection.query(selectBetsQuery.getQuery(), function (err, rows, fields) {
		if (err) {
			throw err;
		}

		cb(rows);
	});
};

MysqlConnector.prototype.selectAllPendingBets = function(cb) {
	var selectBetsQuery = require('./query')(SELECT_ALL_PENDING_BETS);
		
	this.connection.query(selectBetsQuery.getQuery(), function (err, rows, fields) {
		if (err) {
			throw err;
		}

		cb(rows);
	});
};

module.exports = MysqlConnector;
