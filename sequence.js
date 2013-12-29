var moment = require('moment');
var Fixture = require('./fixture');
var Connector = require('./connector');
var moment = require('moment');

function Sequence() {
	this.steps = [];
	this.steps.push({}); //push dummy step
	this.currentStep = 0;
	this.status = 'UNDEFINED';
	this.team = undefined;
	this.dateStarted = moment().format('YYYY-MM-DD');
	this.fixturesApi = new Fixture();
	this.connectionApi = new Connector({
		host: 'localhost',
		user: 'root',
		password: '@bcd!234',
		database: 'martingale'
	});
}

Sequence.prototype.start = function(fixtureId, team) {
	if (this.status === 'UNDEFINED') {
		Sequence.addStep.call(this, fixtureId);
		this.currentStep = 1;
		this.team = team;

	}
};

Sequence.prototype.next = function(cb) {
	//check result of current step's fixture
	//if not draw start next step: add new fixture into step
	var self = this;
	var step = this.steps[this.currentStep];
	this.fixturesApi.readFixture(step.fixtureId, function(rows) {
		if (rows.length === 1 && rows[0].STATUS === 'Fin') {
			if (rows[0].FT_RESULT === 'D') {
				Sequence.finishCurrentStep.call(self);
				Sequence.prototype.finish.call(self, cb);
			} else {
				self.fixturesApi.readNextFixture(self.team, moment(rows[0].MATCH_DATE).format('YYYY-MM-DD'), function(fixture) {
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

Sequence.addStep = function(fixtureId) {
	var step = {};
	step.fixtureId = fixtureId;
	step.status = 'PENDING';
	step.number = this.currentStep + 1;
	this.steps.push(step);
	this.status = 'RUNNING';
	this.currentStep++;

	//save to db
};

Sequence.finishCurrentStep = function() {

	this.steps[this.currentStep].status = 'FINISHED';
};

Sequence.prototype.finish = function(cb) {
	Sequence.finishCurrentStep.call(this);
	cb();
};

Sequence.prototype.printCurrentStep = function( ) {
	if (this.status === 'UNDEFINED') {
		console.log('Sequence not started');
	} else {
		console.log(this.steps[this.currentStep]);
	}
};

Sequence.prototype.printSteps = function( ) {
	if (this.status === 'UNDEFINED') {
		console.log('Sequence not started');
	} else {
		for (var i=0; i<this.steps.length; i++) {
			console.log(this.steps[i]);
		}
	}
};

module.exports = Sequence;