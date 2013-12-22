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
	var series = 0;
	for (var key in this.teams) {
		for(var i=0; i<this.teams[key].length; i++) {
			if (this.teams[key][i].FT_RESULT === "draw") {
				break;
			}
			series += 1;
		}
		if (series >= 3) {
			console.log(key + " : " + series);
			series = 0;
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
}

MartinGaleStrategy.prototype.len = function() {

	console.log(this.matches.length);
};

module.exports = MartinGaleStrategy;