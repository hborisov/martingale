var express = require('express');
var F = require('./fixture');
var S = require('./sequence.js');
var B = require('./bet');
var M = require('./martin_gale_strategy');
var Bet365Client = require('./bet365client');

var fixtures = new F();
var se = new S();
se.load(function() {
	console.log('sequences loaded.');
});
var bets = new B();
var mg = new M();

var app = express();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/webapp'));
});

app.get('/api/sequence', function(req, res) {
  /*res.type('application/json');
  res.send('i am a beautiful butterfly');*/
  se.getSequences(function(sequences) {
	res.json(sequences);
  });
});

app.post('/internal/sequence/:id/advance', function(req, res) {
	se.next(req.params.id, function() {
		res.json({status: 'success'});
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
	var bc = new Bet365Client(req.params.league);
	bc.getOdds(function(odds) {
		res.json(odds);
	});
});

app.listen(process.env.PORT || 8080);