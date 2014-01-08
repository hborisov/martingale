var Bet365Client = require('./bet365client');

if (process.argv[2] === undefined) {
	console.log('Premier League: premier_league');
	console.log('Second Bundes League: second_bundes_league');
	console.log('Serie B: serie_b');
	console.log('--------------');
} else {
	var league = process.argv[2];
	var bc = new Bet365Client(league);
	bc.getOdds(function(odds) {
		console.log(odds);
	});
}

