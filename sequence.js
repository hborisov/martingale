var moment = require('moment');
var Fixture = require('./fixture');
var Connector = require('./connector');
var moment = require('moment');
var uuid = require('node-uuid');
var async = require('async');

fixturesApi = new Fixture();
connectionApi = new Connector({
		host: 'localhost',
		user: 'root',
		password: '@bcd!234',
		database: 'martingale'
});

function SequenceApi() {
	this.sequences = [];
}


function Sequence(fixtureId, team, id, currentStep, status, dateStarted) {
	this.steps = [];
	this.id = id || uuid.v1();
	this.fixtureId = fixtureId;
	this.currentStep = currentStep = typeof currentStep !== 'undefined' ? currentStep : -1;
	this.status = status || 'RUNNING';
	this.team = team;
	this.dateStarted = dateStarted || moment().format('YYYY-MM-DD');
}

function Step(sequenceId, fixtureId, status, number, id) {
	this.sequenceId = sequenceId;
	this.fixtureId = fixtureId;
	this.status = status || 'PENDING';
	this.number = number = typeof number !== 'undefined' ? number : -1;
	this.id = id || uuid.v1();
}

Sequence.prototype.start = function(fixtureId, team) {
	if (this.status === 'NOT_STARTED') {
		Sequence.addStep.call(this, fixtureId);
		this.team = team;
		this.status = 'RUNNING';
	}
};

SequenceApi.prototype.startNewSequence = function(fixtureId, team, cb) {
	var sequence = new Sequence(fixtureId, team);
	var firstStep = new Step(sequence.id, fixtureId);
	sequence.addStep(firstStep);
	this.sequences.push(sequence);
	
	SequenceApi.prototype.saveSequenceToDB(sequence, cb);
};

SequenceApi.prototype.saveSequenceToDB = function(sequence, cb) {
	connectionApi.insertSequence(sequence.id, sequence.fixtureId, sequence.status, sequence.currentStep.toString(), sequence.team, sequence.dateStarted, cb);
};

SequenceApi.prototype.updateSequenceToDB = function(sequence, cb) {
	connectionApi.updateSequence(sequence.id, sequence.status, sequence.currentStep.toString(), cb);
};

SequenceApi.prototype.saveStepToDB = function(step, cb) {
	connectionApi.insertUpdateStep(step.id, step.sequenceId, step.fixtureId, step.status, step.number.toString(), '-1', cb);
};

SequenceApi.prototype.iterator = function(item, callback) {
	/*for (var j=0; j<this.sequences.length; j++) {
		if (this.sequences[j].id === item.APP_ID && item.STATUS === 'FINISHED') {
			this.sequences.splice(j, 1);
			callback(null);
			return;
		} else if (this.sequences[j].id === item.APP_ID) {
			callback(null);
			return;
		}
	}*/

	var sequence = new Sequence(item.FIXTURE_ID, item.TEAM, item.APP_ID, item.CURRENT_STEP, item.STATUS, moment(item.DATE_STARTED).format('YYYY-MM-DD'));
	//if (sequence.status === 'RUNNING') {

		var self = this;
		connectionApi.selectStepsForSequence(item.APP_ID, function(steps) {
			for (var i=0; i<steps.length; i++) {
				var step = new Step(steps[i].SEQUENCE_ID, steps[i].FIXTURE_ID, steps[i].STATUS, steps[i].NUMBER, steps[i].APP_ID);
				sequence.steps.push(step);
			}
			self.sequences.push(sequence);

			callback(null);
		});
	//} else {
	//	callback(null);
	//}
};

SequenceApi.prototype.load = function(cb) {
	this.sequences = [];
	var self = this;
	connectionApi.selectAllSequences(function(rows) {
		async.each(rows, SequenceApi.prototype.iterator.bind(self), function(err) {
			if (err) {
				throw err;
			}

			cb();
		});
	});
};

Sequence.prototype.loadSteps = function() {
};

SequenceApi.prototype.advanceSequence = function(sequenceId) {
	console.log(this.sequences);
};

SequenceApi.prototype.next = function(sequenceId, cb) {
	//check result of current step's fixture
	//if not draw start next step: add new fixture into step
	var sequence;
	for (var i=0; i<this.sequences.length; i++) {
		if (this.sequences[i].id === sequenceId && this.sequences[i].status === 'RUNNING') {
			sequence = this.sequences[i];
			break;
		}
	}

	var self = this;
	if (sequence === undefined) {
		console.log('no sequences found');
		cb();
		return;
	}

	var step = sequence.steps[sequence.currentStep];

	if (step === undefined) {
		console.log('no steps found');
		cb();
		return;
	}


	fixturesApi.readFixture(step.fixtureId.toString(), function(rows) {
		if (rows.length === 1 && rows[0].STATUS === 'Fin') {
			if (rows[0].FT_RESULT === 'D') {
				sequence.finish(cb);
			} else {
				fixturesApi.readNextFixture(sequence.team, moment(rows[0].MATCH_DATE).format('YYYY-MM-DD'), function(fixture) {
					console.log(fixture.ID);
					console.log(sequence.steps[sequence.currentStep]);
					Sequence.finishCurrentStep.call(sequence);
					if (fixture !== undefined) {
						var step = new Step(sequence.id, fixture.ID.toString());
						sequence.addStep(step);
						connectionApi.updateSequence(sequence.id, sequence.status, sequence.currentStep.toString(), function() {
							console.log('updating sequence');
						});

					}
					
					cb();
				});
			}
		} else {
			console.log('Fixture cannot be found or is not finished');
			cb();
		}
	});
};

Sequence.prototype.addStep = function(step) {
	step.number = ++this.currentStep;
	this.steps.push(step);
	
	console.log(step);
	SequenceApi.prototype.saveStepToDB(step, function() {
		console.log('step saved');
	});
};

Sequence.finishCurrentStep = function() {
	this.steps[this.currentStep].status = 'FINISHED';
	
	console.log('finishing step');
	console.log(this);
	console.log(this.steps[this.currentStep].id);
	console.log(this.steps[this.currentStep].status);

	connectionApi.updateStep(this.steps[this.currentStep].id, this.steps[this.currentStep].status, function() {
		console.log('step finished');
	});
};

Sequence.prototype.finish = function(cb) {
	Sequence.finishCurrentStep.call(this);
	this.status = 'FINISHED';

	console.log('finishing');
	console.log(this);
	
	connectionApi.updateSequence(this.id, 'FINISHED', this.currentStep.toString(), function() {
		console.log('finished sequence');
	});
	cb();
};

Sequence.prototype.printCurrentStep = function( ) {
	if (this.status === 'NOT_STARTED') {
		console.log('Sequence not started');
	} else {
		console.log(this.steps[this.currentStep]);
	}
};

Sequence.prototype.printSteps = function( ) {
	if (this.status === 'NOT_STARTED') {
		console.log('Sequence not started');
	} else {
		for (var i=0; i<this.steps.length; i++) {
			//sequenceId, fixtureId, status, number
			console.log('	' + this.steps[i].fixtureId + '   ' + this.steps[i].status + '   ' + this.steps[i].number);
		}
	}
};

Sequence.prototype.printSequence = function() {
	console.log(this.id + '   ' + this.status + '  ' + this.team + '  ' + this.currentStep + '  ' + this.steps.length);

	for (var i=0; i<this.steps.length; i++) {
		console.log('	' + this.steps[i].fixtureId + '   ' + this.steps[i].status + '   ' + this.steps[i].number);
	}
};

SequenceApi.prototype.printSequences = function(fixtureId, team) {
	for (var i=0; i<this.sequences.length; i++) {
		this.sequences[i].printSequence();
	}
};

SequenceApi.prototype.getSequences = function(cb) {
	var self = this;
	SequenceApi.prototype.load.call(self, function() {
		cb(self.sequences);
	});
	
};



module.exports = SequenceApi;