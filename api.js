var express = require('express');
var F = require('./fixture');
var S = require('./sequence.js');
var B = require('./bet');
var M = require('./martin_gale_strategy');
var X = require('./read_xscores_results');
var async = require('async');
var moment = require('moment');

var Bet365Client = require('./bet365client');

var fixtures = new F();
var se = new S();
var bets = new B();
var mg = new M();

function iterator(item, callback) {
	fixtures.readFixture(item.FIXTURE_ID.toString(), function(rows) {
		if (rows.length === 1) {
			if (rows[0].STATUS === 'Fin') {
					if (item.BET === rows[0].FT_RESULT) {
						bets.updateBet(item.ID.toString(), 'WIN', function(changedRows) {
							console.log('Bet wins');
							callback(null);
						});
					} else {
						bets.updateBet(item.ID.toString(), 'LOSE', function(changedRows) {
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

function sequenceIterator(sequence, callback) {
	se.next(sequence.id, function() {
		callback(null);
	});
}

var app = express();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/webapp'));
});

app.get('/api/sequence', function(req, res) {
  se.load(function() {
	console.log('sequences loaded.');
		se.getSequences(function(sequences) {
			res.json(sequences);
		});
	});
  
});

app.post('/internal/sequence/:id/advance', function(req, res) {
	se.next(req.params.id, function() {
		res.json({status: 'success'});
	});
});

app.post('/internal/sequence/advance', function(req, res) {
	se.load(function() {
		se.getSequences(function(sequences) {

			async.each(sequences, sequenceIterator, function(err) {
				if (err) {
					throw err;
				}

				res.json({status: 'success'});
			});
		});
	});
	
});

app.post('/api/sequence', function(req, res) {
	se.startNewSequence(req.body.fixtureId, req.body.teamName, function() {
		res.json({status: 'success'});
	});
});

app.get('/api/fixture', function(req, res) {
	fixtures.readFixtures(function(fixtures){
		res.json(fixtures);
	});
});

app.get('/api/fixture/next', function(req, res) {
	fixtures.readNextFixture(req.query.teamName, moment().format('YYYY-MM-DD'), function(fixture) {
		res.json(fixture);
	});
});

app.get('/api/fixture/:id', function(req, res) {
	fixtures.readFixture(req.params.id, function(fixture){
		res.json(fixture);
	});
});

app.get('/api/bet', function(req, res) {
	if (req.query.pending && req.query.pending === 'true') {
		bets.readPendingBets(function(pendingBets) {
			res.json(pendingBets);
		});
	} else {
		bets.readBets(function(bets) {
			res.json(bets);
		});
	}
});

app.post('/api/bet', function(req, res) {
	//:fixtureId/:amount/:odd/:team/:bet

	console.log(req.query);
	console.log(req.params);
	console.log(req.body);
	bets.placeBet(req.body.fixtureId, req.body.amount, req.body.odd, req.body.teamName, req.body.bet, function() {
		res.json({status: 'success'});
	});
});

app.get('/api/draws', function(req, res) {
	mg.load(function() {
		mg.separateTeamResults();
		mg.separateTeams();
		res.json(mg.getMatchesWithoutDraw());
	});
});

app.get('/api/odds/:league', function(req, res) {
	var bc = new Bet365Client();

	bc.reset(req.params.league);
	bc.getOdds(function(odds) {
		res.json(odds);
	});
});

	
app.post('/internal/fixtures', function(req, res) {
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
	var month = req.body.month || '1';
	var seasonName = req.body.seasonName || '2013%2F2014';
	for (var i=0; i<count.i; i++) {
		options.path = '/soccer/Results.jsp?sport=1&countryName='+ leagues[i][0] +'&leagueName='+ leagues[i][1] +'&sortBy=P&seasonName='+ seasonName +'&month='+ month +'&result=3';
		xscores = new X();
		xscores.makeRequest(options, function() {
			count.i--;
			
			if(count.i === 1) {
				console.log('start reading bets');
				bets.readPendingBets(function(pendingBets) {
					async.each(pendingBets, iterator, function(err) {
						if (err) {
							res.json({status: 'failure', message: err});
						}

						res.json({status: 'success'});
					});
				});
			}
		});
	}
});

app.get('/api/money', function(req, res) {
	var money = {};
	money.inplay = 0;
	money.profit = 510.80;
	bets.readBets(function(bets) {
		for (var i=0; i<bets.length; i++) {
			var profit = bets[i].ODD * bets[i].AMOUNT;
			if (bets[i].RESULT === 'PENDING') {
				money.inplay += profit;
			} else if (bets[i].RESULT === 'WIN') {
				money.profit += profit;
			} else if (bets[i].RESULT === 'LOSE') {
				money.profit -= bets[i].AMOUNT;
			}
		}

		money.inplay = money.inplay.toFixed(2);
		money.profit = money.profit.toFixed(2);
		res.json(money);
	});
});


app.listen(process.env.PORT || 8080);