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

Sequence.prototype.next = function() {
	//check result of current step's fixture
	//if not draw start next step: add new fixture into step
	var self = this;
	var step = this.steps[this.currentStep];
	this.fixturesApi.readFixture(step.fixtureId, function(rows) {
		if (rows.length === 1) {
			if (rows[0].FT_RESULT === 'D') {
				Sequence.prototype.end();
			} else {
				self.fixturesApi.readNextFixture(self.team, moment(rows[0].MATCH_DATE).format('YYYY-MM-DD'), function(fixture) {
					console.log(fixture);
					Sequence.addStep.call(self,fixture.ID);
				});
			}
		} else {
			console.log('Fixture cannot be found');
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

	//save to db
};

Sequence.prototype.end = function( ) {
	console.log('end');
};

Sequence.prototype.printCurrentStep = function( ) {
	if (this.status === 'UNDEFINED') {
		console.log('Sequence not started');
	} else {
		console.log(this.steps[this.currentStep]);
	}
	
};

module.exports = Sequence;