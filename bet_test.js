var Bet = require('./bet');
var b = new Bet();

/*b.placeBet('10168', '50', '3.45', 'FULHAM', 'D', function() {
	console.log('bet placed');
	process.exit();
});*/

b.updateBet('1', 'WIN', function(result) {
	if (result !== 0) {
		console.log('bet updated');
	} else {
		console.log('bet not updated');
	}
	process.exit();
});