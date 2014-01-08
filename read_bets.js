var Bet = require('./bet');
var Fixture = require('./fixture');
var async = require('async');

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
		}
	});

}

b.readPendingBets(function(pendingBets) {
	
	async.each(pendingBets, iterator, function(err) {
		if (err) {
			throw err;
		}

		process.exit();
	});
});