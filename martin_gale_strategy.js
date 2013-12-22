var Connector = require('./connector');

function MartinGaleStrategy() {
	this.matches = [];
	this.teamResults = [];
	this.teams = {};
	this.loaded = false;
	this.connection = new Connector({
		host: 'localhost',
		user: 'root',
		password: '@bcd!234',
		database: 'martingale'
	});

	
}

MartinGaleStrategy.prototype.load = function (cb) {
	this.connection.selectAllMatches((function(rows) {
		rows.forEach((function(element, index, array) {
			this.matches.push(element);
		}).bind(this));

		this.loaded = true;
		cb();
	}).bind(this), cb);
};

MartinGaleStrategy.prototype.getMatchesWithoutDraw = function() {
	var teamsMatches = [];
	

	for (var j=0; j<200; j++) {
		if (teamsMatches[j].TEAM === "Man United") {
			console.log("> " + teamsMatches[j].MATCH_DATE + "    " + teamsMatches[j].TEAM + "   " + teamsMatches[j].FT_RESULT);	
		}
	}
};

MartinGaleStrategy.prototype.separateTeamResults = function() {
	var currentMatch;
	for (var i=0; i<this.matches.length; i++) {

		currentMatch = {};
		currentMatch.DIVISION = this.matches[i].DIVISION;
		currentMatch.MATCH_DATE = this.matches[i].MATCH_DATE;
		currentMatch.TEAM = this.matches[i].AWAY_TEAM;
		if (this.matches[i].FT_RESULT === "A") {
			currentMatch.FT_RESULT = "win";	
		} else if (this.matches[i].FT_RESULT === "H") {
			currentMatch.FT_RESULT = "lose";
		} else {
			currentMatch.FT_RESULT = "draw";
		}
		this.teamResults.push(currentMatch);


		currentMatch = {};
		currentMatch.DIVISION = this.matches[i].DIVISION;
		currentMatch.MATCH_DATE = this.matches[i].MATCH_DATE;
		currentMatch.TEAM = this.matches[i].HOME_TEAM;
		if (this.matches[i].FT_RESULT === "H") {
			currentMatch.FT_RESULT = "win";	
		} else if (this.matches[i].FT_RESULT === "A") {
			currentMatch.FT_RESULT = "lose";
		} else {
			currentMatch.FT_RESULT = "draw";
		}
		this.teamResults.push(currentMatch);
	}
};

MartinGaleStrategy.prototype.separateTeams = function() {
	
	for (var i=0; i<this.teamResults.length; i++) {
		if (this.teams[this.teamResults[i].TEAM] === undefined) {
			this.teams[this.teamResults[i].TEAM] = [];
		} 
		
		this.teams[this.teamResults[i].TEAM].push(this.teamResults[i]);
	}

	for (var j=0; j<this.teams["Man United"].length; j++) {
		console.log(this.teams["Man United"][j].TEAM + ":  " + this.teams["Man United"][j].MATCH_DATE + "  " + this.teams["Man United"][j].FT_RESULT);
	}
}

MartinGaleStrategy.prototype.len = function() {

	console.log(this.matches.length);
};

module.exports = MartinGaleStrategy;