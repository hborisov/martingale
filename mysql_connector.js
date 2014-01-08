var mysql = require('mysql');
var async = require('async');

module.exports = MySQLConnector;

function MySQLConnector() {
	
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '@bcd!234',
	  database : 'martingale'
	});

	var SELECT_MATCH_STATEMENT = "SELECT * FROM CSVData WHERE DIVISION = %1 AND MATCH_DATE = str_to_date(%2, '%d/%m/%Y') AND HOME_TEAM = %3 AND AWAY_TEAM = %4";
	var INSERT_MATCH_STATEMENT = "INSERT INTO CSVData (DIVISION, MATCH_DATE, HOME_TEAM, AWAY_TEAM, FT_HOME_GOALS, FT_AWAY_GOALS, FT_RESULT) VALUES (%1, str_to_date(%2, '%d/%m/%Y'), %3, %4, %5, %6, %7)";

	var _checkIfMatchExists = function(csvDataRow, cb) {

			var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
			checkMatchQuery.setParameter('1', csvDataRow.DIVISION);
			checkMatchQuery.setParameter('2', csvDataRow.MATCH_DATE);
			checkMatchQuery.setParameter('3', csvDataRow.HOME_TEAM);
			checkMatchQuery.setParameter('4', csvDataRow.AWAY_TEAM);

	        console.log(checkMatchQuery.getQuery());
		    connection.query(checkMatchQuery.getQuery(), cb);
	};

	var _insertNewMatch = function(matchData, cb) {
		
		var insertMatchQuery = require('./query')(INSERT_MATCH_STATEMENT);
		insertMatchQuery.setParameter('1', matchData.DIVISION);
		insertMatchQuery.setParameter('2', matchData.MATCH_DATE);
		insertMatchQuery.setParameter('3', matchData.HOME_TEAM);
		insertMatchQuery.setParameter('4', matchData.AWAY_TEAM);
		insertMatchQuery.setParameter('5', matchData.FT_HOME_GOALS);
		insertMatchQuery.setParameter('6', matchData.FT_AWAY_GOALS);
		insertMatchQuery.setParameter('7', matchData.FT_RESULT);
		console.log(insertMatchQuery.getQuery());
		
		connection.query(insertMatchQuery.getQuery(), cb);
	};


	var result = {};
	result.checkIfMatchExists = function(csvDataRow, cb) {
		return _checkIfMatchExists(csvDataRow, cb);
	};
	result.insertNewMatch = function(matchData, cb) {
		return _insertNewMatch(matchData, cb);
	};
	result.insertIfNotExists = function(csvDataRow, cb) {
		_checkIfMatchExists(csvDataRow, function(err, rows, fields) {
			if (err) {
	  			throw err;
	  		}

	  		console.log("Length: " + rows.length);
	  		if (rows.length === 0) {
	  			_insertNewMatch(csvDataRow, function(err, rows, fields) {
	  				if(err) {
	  					throw err;
	  				}

	  				console.log("Match inserted");
	  			});
	  		} else {
	  			console.log("Match already exists");
	  		}
		});

		cb();	
	};

	return result;
}