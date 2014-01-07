var mysql = require('mysql');

var SELECT_MATCH_STATEMENT = "SELECT * FROM csvdata WHERE DIVISION = %1 AND MATCH_DATE = %2 AND HOME_TEAM = %3 AND AWAY_TEAM = %4";
var SELECT_MATCH_BYID_STATEMENT = "SELECT * FROM csvdata WHERE ID = %1";
var SELECT_TEAM_MATCHES_AFTER_DATE_STATEMENT  = "SELECT * FROM csvdata WHERE MATCH_DATE > %1 AND (HOME_TEAM = %2 OR AWAY_TEAM = %2) ORDER BY MATCH_DATE ASC";
var INSERT_MATCH_STATEMENT = "INSERT INTO csvdata (DIVISION, MATCH_DATE, HOME_TEAM, AWAY_TEAM, FT_HOME_GOALS, FT_AWAY_GOALS, FT_RESULT, STATUS) VALUES (%1, %2, %3, %4, %5, %6, %7, %8)";
var UPDATE_MATCH_STATEMENT = "UPDATE csvdata SET FT_HOME_GOALS = %1, FT_AWAY_GOALS = %2, FT_RESULT = %3, STATUS = %4 WHERE DIVISION = %5 AND MATCH_DATE = %6 AND HOME_TEAM = %7 AND AWAY_TEAM = %8";
var SELECT_ALL_MATCHES = "SELECT * FROM csvdata WHERE MATCH_DATE > '2013-08-01' ORDER BY MATCH_DATE DESC";
var INSERT_BET_STATEMENT = "INSERT INTO bet (FIXTURE_ID, AMOUNT, ODD, TEAM, BET, DATE, RESULT) VALUES ( %1, %2, %3, %4, %5, %6, %7)";
var UPDATE_BET_STATEMENT = "UPDATE bet SET RESULT = %1 WHERE ID = %2";
var SELECT_ALL_BETS = "SELECT * FROM bet";
var SELECT_ALL_PENDING_BETS = "SELECT * FROM bet WHERE RESULT = 'PENDING'";
var INSERT_SEQUENCE_STATEMENT = "INSERT INTO sequence (APP_ID, FIXTURE_ID, STATUS, CURRENT_STEP, TEAM, DATE_STARTED) VALUES (%1, %2, %3, %4, %5, %6)";
var UPDATE_SEQUENCE_STATEMENT = "UPDATE sequence SET STATUS = %1, CURRENT_STEP = %2 WHERE APP_ID = %3";
var INSERT_STEP_STATEMENT = "INSERT INTO step (APP_ID, SEQUENCE_ID, FIXTURE_ID, STATUS, NUMBER, BET_ID) VALUES (%1, %2, %3, %4, %5, %6)";
var SELECT_ALL_SEQUENCES = "SELECT * FROM sequence";
var SELECT_ALL_STEPS_FOR_SEQUENCE = "SELECT * FROM step WHERE SEQUENCE_ID = %1";
var SELECT_STEP_STATEMENT = "SELECT * FROM step WHERE APP_ID = %1";
var UPDATE_STEP_STATEMENT = "UPDATE step SET STATUS = %1 WHERE APP_ID = %2";

function MysqlConnector(options) {
	this.pool  = mysql.createPool(options);
}



MysqlConnector.prototype.checkIfMatchExists = function(matchData, cb) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);
   
   this.pool.getConnection(function(err, connection) {
		connection.query(checkMatchQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			connection.release();
			return (rows.length > 0) ? true : false;
		});
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
	
	this.pool.getConnection(function(err, connection) {
		connection.query(insertMatchQuery.getQuery(), function() {
			cb();
			connection.release();
		});
	});
};

MysqlConnector.prototype.insertIfMatchNotExistsWithCallback = function(matchData, cb, cnt) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);

	this.pool.getConnection(function(err, connection) {
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
				insertMatchQuery.setParameter('8', matchData.STATUS);

				connection.query(insertMatchQuery.getQuery(), function(err, rows, fields) {
					if (err) {
						throw err;
					}

					cb(cnt);
					connection.release();
				});
			} else {
				cb(cnt);
				connection.release();
			}
		});
	});
};

MysqlConnector.prototype.insertUpdate = function(matchData, cnt, cb) {
	var checkMatchQuery = require('./query')(SELECT_MATCH_STATEMENT);
	checkMatchQuery.setParameter('1', matchData.DIVISION);
	checkMatchQuery.setParameter('2', matchData.MATCH_DATE);
	checkMatchQuery.setParameter('3', matchData.HOME_TEAM);
	checkMatchQuery.setParameter('4', matchData.AWAY_TEAM);

	this.pool.getConnection(function(err, connection) {
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
				insertMatchQuery.setParameter('8', matchData.STATUS);

				connection.query(insertMatchQuery.getQuery(), function(err, rows, fields) {
					if (err) {
						throw err;
					}

					cb(cnt);
					connection.release();
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

				connection.query(updateMatchQuery.getQuery(), function(err, rows, fields) {
					if (err) {
						throw err;
					}

					cb(cnt);
					connection.release();
				});
			}
		});
	});
    
};

MysqlConnector.prototype.selectAllMatches = function(cb) {
	var selectAllMatchesQuery = require('./query')(SELECT_ALL_MATCHES);

	this.pool.getConnection(function(err, connection) {
		connection.query(selectAllMatchesQuery.getQuery(), function(err, rows, fields) {
			if(err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.selectMatchById = function(matchId, cb) {
	var selectMatchByIdQuery = require('./query')(SELECT_MATCH_BYID_STATEMENT);
		selectMatchByIdQuery.setParameter('1', matchId);

	this.pool.getConnection(function(err, connection) {
		connection.query(selectMatchByIdQuery.getQuery(), function(err, rows, fields) {
			if(err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.selectNextTeamMatch = function(team, date, cb) {
	var selectTeamMatchesAfterDateQuery = require('./query')(SELECT_TEAM_MATCHES_AFTER_DATE_STATEMENT);
		selectTeamMatchesAfterDateQuery.setParameter('1', date);
		selectTeamMatchesAfterDateQuery.setParameter('2', team);

	this.pool.getConnection(function(err, connection) {
		connection.query(selectTeamMatchesAfterDateQuery.getQuery(), function(err, rows, fields) {
			if(err) {
				throw err;
			}

			cb(rows[0]);
			connection.release();
		});
	});
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

	this.pool.getConnection(function(err, connection) {
		connection.query(insertBetQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb();
			connection.release();
		});
	});
};

MysqlConnector.prototype.updateBet = function(betId, result, cb) {
	var updateBetQuery = require('./query')(UPDATE_BET_STATEMENT);
		updateBetQuery.setParameter('1', result);
		updateBetQuery.setParameter('2', betId);

	this.pool.getConnection(function(err, connection) {
		connection.query(updateBetQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows.changedRows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.selectAllBets = function(cb) {
	var selectBetsQuery = require('./query')(SELECT_ALL_BETS);
		
	this.pool.getConnection(function(err, connection) {
		connection.query(selectBetsQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.selectAllPendingBets = function(cb) {
	var selectBetsQuery = require('./query')(SELECT_ALL_PENDING_BETS);
	
	this.pool.getConnection(function(err, connection) {
		connection.query(selectBetsQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.insertSequence = function(appId, fixtureId, status, currentStep, team, dateStarted, cb) {
	var insertSequenceQuery = require('./query')(INSERT_SEQUENCE_STATEMENT);
		insertSequenceQuery.setParameter('1', appId);
		insertSequenceQuery.setParameter('2', fixtureId);
		insertSequenceQuery.setParameter('3', status);
		insertSequenceQuery.setParameter('4', currentStep);
		insertSequenceQuery.setParameter('5', team);
		insertSequenceQuery.setParameter('6', dateStarted);

		this.pool.getConnection(function(err, connection) {
			connection.query(insertSequenceQuery.getQuery(), function (err, rows, fields) {
				if (err) {
					throw err;
				}

				cb(rows);
				connection.release();
			});
		});
};

MysqlConnector.prototype.updateSequence = function(appId, status, currentStep, cb) {
	var updateSequenceQuery = require('./query')(UPDATE_SEQUENCE_STATEMENT);
		updateSequenceQuery.setParameter('1', status);
		updateSequenceQuery.setParameter('2', currentStep);
		updateSequenceQuery.setParameter('3', appId);

	this.pool.getConnection(function(err, connection) {
		connection.query(updateSequenceQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.selectAllSequences = function(cb) {
	var selectSequencesQuery = require('./query')(SELECT_ALL_SEQUENCES);
		
	this.pool.getConnection(function(err, conn) {
		conn.query(selectSequencesQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			conn.release();
		});
	});
};


MysqlConnector.prototype.insertUpdateStep = function(id, sequenceId, fixtureId, status, number, betId, cb) {
	var selectStepQuery = require('./query')(SELECT_STEP_STATEMENT);
	selectStepQuery.setParameter('1', id);
		
	this.pool.getConnection(function(err, connection) {
		connection.query(selectStepQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}
			if (rows.length === 0) {
				var insertStepQuery = require('./query')(INSERT_STEP_STATEMENT);
				insertStepQuery.setParameter('1', id);
				insertStepQuery.setParameter('2', sequenceId);
				insertStepQuery.setParameter('3', fixtureId);
				insertStepQuery.setParameter('4', status);
				insertStepQuery.setParameter('5', number);
				insertStepQuery.setParameter('6', betId);

				connection.query(insertStepQuery.getQuery(), function (err, rows, fields) {
					if (err) {
						throw err;
					}

					cb(rows);
					connection.release();
				});
			} else {
				var updateStepQuery = require('./query')(UPDATE_STEP_STATEMENT);
				updateStepQuery.setParameter('1', status);
				updateStepQuery.setParameter('2', id);
					
				connection.query(updateStepQuery.getQuery(), function (err, rows, fields) {
					if (err) {
						throw err;
					}

					cb(rows);
					connection.release();
				});
			}

		});
	});
	
};

MysqlConnector.prototype.selectStepsForSequence = function(sequenceId, cb) {
	var selectStepsForSequence = require('./query')(SELECT_ALL_STEPS_FOR_SEQUENCE);
		selectStepsForSequence.setParameter('1', sequenceId);
		
		this.pool.getConnection(function(err, connection) {
			connection.query(selectStepsForSequence.getQuery(), function (err, rows, fields) {
				if (err) {
					throw err;
				}

				cb(rows);
				connection.release();
			});
		});
};

MysqlConnector.prototype.selectStep = function(id, cb) {
	var selectStepQuery = require('./query')(SELECT_STEP_STATEMENT);
	selectStepQuery.setParameter('1', id);
		
	this.pool.getConnection(function(err, connection) {
		connection.query(selectStepQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

MysqlConnector.prototype.updateStep = function(id, status, cb) {
	var updateStepQuery = require('./query')(UPDATE_STEP_STATEMENT);
	updateStepQuery.setParameter('1', status);
	updateStepQuery.setParameter('2', id);
		
	this.pool.getConnection(function(err, connection) {
		connection.query(updateStepQuery.getQuery(), function (err, rows, fields) {
			if (err) {
				throw err;
			}

			cb(rows);
			connection.release();
		});
	});
};

module.exports = MysqlConnector;
