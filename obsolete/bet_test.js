var Bet = require('./bet');
var b = new Bet();

b.placeBet('56', '4', '3.25', 'ASTON VILLA', 'D', function() {
	console.log('bet placed');
	process.exit();
});

/*b.updateBet('1', 'WIN', function(result) {
	if (result !== 0) {
		console.log('bet updated');
	} else {
		console.log('bet not updated');
	}
	process.exit();
});*/

b.readBets(function(rows) {
	for (var i=0; i<rows.length; i++) {
		console.log(rows[i]);
	}

	process.exit();
});