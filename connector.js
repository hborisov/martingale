var mysql = require('mysql');
var async = require('async');

var SELECT_MATCH_STATEMENT = "SELECT * FROM CSVData WHERE DIVISION = %1 AND MATCH_DATE = %2 AND HOME_TEAM = %3 AND AWAY_TEAM = %4";
var INSERT_MATCH_STATEMENT = "INSERT INTO CSVData (DIVISION, MATCH_DATE, HOME_TEAM, AWAY_TEAM, FT_HOME_GOALS, FT_AWAY_GOALS, FT_RESULT, STATUS) VALUES (%1, %2, %3, %4, %5, %6, %7, %8)";
var UPDATE_MATCH_STATEMENT = "UPDATE CSVData SET FT_HOME_GOALS = %1, FT_AWAY_GOALS = %2, FT_RESULT = %3, STATUS = %4 WHERE DIVISION = %5 AND MATCH_DATE = %6 AND HOME_TEAM = %7 AND AWAY_TEAM = %8";
var SELECT_ALL_MATCHES = "SELECT * FROM CSVData WHERE MATCH_DATE > '2013-08-01' ORDER BY MATCH_DATE DESC";

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

module.exports = MysqlConnector;
