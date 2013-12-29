var s = require('./sequence.js');

var sequence = new s();

sequence.printCurrentStep();

sequence.start('318', 'SPARTAK');

sequence.printSteps();
sequence.next(function() {
	sequence.printSteps();
	sequence.next(function() {
		sequence.printSteps();
		sequence.next(function() {
			sequence.printSteps();
			process.exit();
		});
	});
});
