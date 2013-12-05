var mysql = require('mysql');

module.exports = MySQLConnector;

function MySQLConnector() {
	
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '@bcd!234',
	  database : 'martingale'
	});

	var SELECT_MATCH_STATEMENT = "SELECT * FROM CSVData WHERE DIVISION = %1 AND MATCH_DATE = %2 AND HOME_TEAM = %3 AND AWAY_TEAM = %4";



	var _checkIfMatchExists = function(csvDataRow) {
			connection.connect();

			var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
			checkMatchQuery.setParameter('1', csvDataRow.DIVISION);
			checkMatchQuery.setParameter('2', csvDataRow.MATCH_DATE);
			checkMatchQuery.setParameter('3', csvDataRow.HOME_TEAM);
			checkMatchQuery.setParameter('4', csvDataRow.AWAY_TEAM);
			var result;

			connection.query(checkMatchQuery.getQuery(), function(err, rows, fields) {
				if (err) {
	  				throw err;
	  			}

				console.log(result);
	  			return ((rows.length > 0) ? true : false); 
			});

			connection.end();

			return result;
	};

	var result = {};
	result.checkIfMatchExists = function(csvDataRow) {
		return _checkIfMatchExists(csvDataRow);
	};

	return result;
}