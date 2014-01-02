var express = require('express');
var F = require('./fixture');
var S = require('./sequence.js');
var B = require('./bet');

var fixtures = new F();
var se = new S();
se.load(function() {
	console.log('sequences loaded.');
});
var bets = new B();

var app = express();

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

app.post('/api/sequence/:fixtureId/:teamName', function(req, res) {
	se.startNewSequence(req.params.fixtureId, req.params.teamName, function() {
		res.json({status: 'success'});
	});
});

app.get('/api/fixture', function(req, res) {
	fixtures.readFixtures(function(fixtures){
		res.json(fixtures);
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
/*
app.get('/api/bet/pending', function(req, res) {
	
});*/

app.post('/api/bet', function(req, res) {
	//:fixtureId/:amount/:odd/:team/:bet

	console.log(req.query.amount);
	bets.placeBet(req.query.fixtureId, req.query.amount, req.query.odd, req.query.team, req.query.bet, function() {
		res.json({status: 'success'});
	});
});

app.configure(function() {
	app.use(express.static(__dirname + '\\webapp'));
});
app.listen(process.env.PORT || 8080);