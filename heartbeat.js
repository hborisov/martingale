var Bet = require('./bet');
var Fixture = require('./fixture');
var async = require('async');
var X = require('./read_xscores_results');

var b = new Bet();
var f = new Fixture();

function iterator(item, callback) {
	f.readFixture(item.FIXTURE_ID.toString(), function(rows) {
		if (rows.length === 1) {
			if (rows[0].STATUS === 'Fin') {
					if (item.BET === rows[0].FT_RESULT) {
						b.updateBet(item.ID.toString(), 'WIN', function(changedRows) {
							console.log('Bet wins');
							callback(null);
						});
					} else {
						b.updateBet(item.ID.toString(), 'LOSE', function(changedRows) {
							console.log('Bet loses');
							callback(null);
						});
					}
				} else {
					console.log('nothing to update');
					callback(null);
				}
		} else {
			callback(null);
		}
	});

}

var leagues = [['FRANCE', 'LIGUE+1'],
					['FRANCE', 'LIGUE+2'],
					['ENGLAND', 'PREMIER+LEAGUE'],
					['ENGLAND', 'CHAMPIONSHIP'],
					['GERMANY', 'BUNDESLIGA'],
					['GERMANY', '2.+BUNDESLIGA'],
					['ITALY', 'SERIE+A'],
					['ITALY', 'SERIE+B']];

	var options = {
		hostname: 'www.xscores.com',
		port: 80,
		method: 'GET'
	};

	var xscores = {};
	var count = {};
	count.i = leagues.length;
	var month = '1';
	var seasonName = '2013%2F2014';
	for (var i=0; i<count.i; i++) {
		options.path = '/soccer/Results.jsp?sport=1&countryName='+ leagues[i][0] +'&leagueName='+ leagues[i][1] +'&sortBy=P&seasonName='+ seasonName +'&month='+ month +'&result=3';
		xscores = new X();
		xscores.makeRequest(options, function() {
			count.i--;
			
			if(count.i === 1) {
				console.log('start reading bets');
				b.readPendingBets(function(pendingBets) {
					async.each(pendingBets, iterator, function(err) {
						if (err) {
							throw err;
						}

						process.exit();
					});
				});
			}
		});
	}