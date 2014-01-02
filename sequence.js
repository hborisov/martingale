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

function Step(sequenceId, fixtureId, status, number) {
	this.sequenceId = sequenceId;
	this.fixtureId = fixtureId;
	this.status = status || 'PENDING';
	this.number = number = typeof number !== 'undefined' ? number : -1;
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
	connectionApi.insertStep(step.sequenceId, step.fixtureId, step.status, step.number.toString(), '-1', cb);
};

SequenceApi.prototype.iterator = function(item, callback) {
	var sequence = new Sequence(item.FIXTURE_ID, item.TEAM, item.APP_ID, item.CURRENT_STEP, item.STATUS, moment(item.DATE_STARTED).format('YYYY-MM-DD'));

	if (sequence.status === 'RUNNING') {
		
		var self = this;
		connectionApi.selectStepsForSequence(item.APP_ID, function(steps) {
			for (var i=0; i<steps.length; i++) {
				//sequenceId, fixtureId, status, number
				var step = new Step(steps[i].SEQUENCE_ID, steps[i].FIXTURE_ID, steps[i].STATUS, steps[i].NUMBER);
				sequence.steps.push(step);
				//console.log(sequence);
			}

			//console.log(sequence);
			self.sequences.push(sequence);

			callback(null);
		});
	}
};

SequenceApi.prototype.load = function(cb) {
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

Sequence.prototype.next = function(cb) {
	//check result of current step's fixture
	//if not draw start next step: add new fixture into step
	var self = this;
	var step = this.steps[this.currentStep];
	fixturesApi.readFixture(step.fixtureId, function(rows) {
		if (rows.length === 1 && rows[0].STATUS === 'Fin') {
			if (rows[0].FT_RESULT === 'D') {
				Sequence.finishCurrentStep.call(self);
				Sequence.prototype.finish.call(self, cb);
			} else {
				fixturesApi.readNextFixture(self.team, moment(rows[0].MATCH_DATE).format('YYYY-MM-DD'), function(fixture) {
					Sequence.finishCurrentStep.call(self);
					if (fixture !== undefined) {
						Sequence.addStep.call(self, fixture.ID.toString());
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
};

Sequence.prototype.finish = function(cb) {
	Sequence.finishCurrentStep.call(this);
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
	console.log(this.status + '  ' + this.team + '  ' + this.currentStep + '  ' + this.steps.length);

	for (var i=0; i<this.steps.length; i++) {
		console.log('	' + this.steps[i].fixtureId + '   ' + this.steps[i].status + '   ' + this.steps[i].number);
	}
};

SequenceApi.prototype.printSequences = function(fixtureId, team) {
	for (var i=0; i<this.sequences.length; i++) {
		this.sequences[i].printSequence();
	}
};

module.exports = SequenceApi;