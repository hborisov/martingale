var s = require('./sequence.js');

/*var sequence = new s();

sequence.printCurrentStep();

sequence.start('318', 'SPARTAK');

sequence.printSteps();*/

/*sequence.next(function() {
	sequence.printSteps();
	sequence.next(function() {
		sequence.printSteps();
		sequence.next(function() {
			sequence.printSteps();
			process.exit();
		});
	});
});
*/

var se = new s();
se.load(function() {
	se.printSequences();
	se.next('51deb160-73c4-11e3-998c-b1cd11e7fd9d', function() {
		console.log('asd');
	});
	se.printSequences();
});
/*
se.startNewSequence('959', 'Loko', function() {
se.printSequences();
});*/
