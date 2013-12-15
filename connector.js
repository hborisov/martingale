var mysql = require('mysql');
var async = require('async');

var SELECT_MATCH_STATEMENT = "SELECT * FROM CSVData WHERE DIVISION = %1 AND MATCH_DATE = str_to_date(%2, '%d/%m/%Y') AND HOME_TEAM = %3 AND AWAY_TEAM = %4";
var INSERT_MATCH_STATEMENT = "INSERT INTO CSVData (DIVISION, MATCH_DATE, HOME_TEAM, AWAY_TEAM, FT_HOME_GOALS, FT_AWAY_GOALS, FT_RESULT) VALUES (%1, str_to_date(%2, '%d/%m/%Y'), %3, %4, %5, %6, %7)";
var SELECT_ALL_MATCHES = "SELECT * FROM CSVData";

var intermediateResult;
var connection;

function mysqlCallback(err, rows, fields) {
	if (err) {
		throw err;
	}

	return (rows.length > 0) ? true : false; 
}

function MysqlConnector(options) {
	this.connectionOptions = {};
	this.connectionOptions.host = options.host;
	this.connectionOptions.user = options.user;
	this.connectionOptions.password = options.password;
	this.connectionOptions.database = options.database;

	connection = mysql.createConnection(this.connectionOptions);
}

MysqlConnector.prototype.checkIfMatchExists = function(matchData, cb) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);
   
    connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
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
	
	connection.query(insertMatchQuery.getQuery(), cb);
};

MysqlConnector.prototype.insertIfMatchNotExistsWithCallback = function(matchData, cb, cnt) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);

    connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
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

			connection.query(insertMatchQuery.getQuery(), function(err, rows, fields) {
				cb(cnt);
			});
		} else {
			cb(cnt);
		}
	});
};

MysqlConnector.prototype.selectAllMatches = function(cb) {
	var selectAllMatchesQuery = require('./query')(SELECT_ALL_MATCHES);
	connection.query(selectAllMatchesQuery.getQuery(), function(err, rows, fields) {
		if(err) {
			throw err;
		}

		cb(rows);
	});
};

module.exports = MysqlConnector;
