var s = require('./sequence.js');

var sequence = new s();

sequence.printCurrentStep();

sequence.start('28', 'EVERTON');

sequence.printCurrentStep();
sequence.next();
sequence.printCurrentStep();
//sequence.printCurrentStep();