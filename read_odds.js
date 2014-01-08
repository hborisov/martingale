fs = require('fs');

function Odds(input) {
	this.data = input;//= fs.readFileSync('../test_data/FlashData.asp.txt', 'utf8');
	this.dataParts = this.data.split('|');
	this.pages = [];
	this.odds = [];
	this.match = {};

	for (var i=0; i<this.dataParts.length; i++) {
		var page;
		var pageElement = {};
		var elements = this.dataParts[i].split(';');
		if (Odds.startsWith(this.dataParts[i], "CO")) {
			if (page !== undefined) {
				this.pages.push(page);
			}
			page = {};
			page.matchData = [];
		}

		for (var q=0; q<elements.length; q++) {
			if (Odds.contains(elements[q], '=')) {
				var keyValue = elements[q].split('=');
				pageElement[keyValue[0]] = keyValue[1];
			} else {
				pageElement[elements[q]] = '';
			}
		}

		if (Odds.startsWith(this.dataParts[i], "PA")) {
			page.matchData.push(pageElement);
		} else if (Odds.startsWith(this.dataParts[i], "CO")) {
			var pagenumber = pageElement.ID.substr(0,2);
			pageElement.pageNumber = pagenumber;
			var id = pageElement.ID.substr(4,pageElement.ID.length);
			pageElement.identification = id;

			page.preambule = pageElement;
		}
	}
	this.pages.push(page);


	for (var k=0; k<this.pages.length; k++) {
		if (this.pages[k].preambule.pageNumber === 'C1') {
			for (var l=0; l<this.pages[k].matchData.length; l++) {
				this.match = {};
				this.match.date = this.pages[k].matchData[l].NA;
				this.match.id = this.pages[k].matchData[l].ID;
				this.match.idInt = parseInt(this.pages[k].matchData[l].ID, 10);
				this.odds.push(this.match);
			}
		}
		if (this.pages[k].preambule.pageNumber === 'C2') {
			for (var m=0; m<this.pages[k].matchData.length; m++) {
				this.match = this.odds[m];
				this.match.name = this.pages[k].matchData[m].NA;
			}
		}
		if (this.pages[k].preambule.pageNumber === 'C3') {
			for (var n=0; n<this.pages[k].matchData.length; n++) {
				this.match = this.odds[n];
				this.match.odd1Imperial = this.pages[k].matchData[n].OD;
				this.match.odd1 = Odds.convertOdds(this.pages[k].matchData[n].OD);
				this.match.odd1FI = this.pages[k].matchData[n].FI;
			}
		}
		if (this.pages[k].preambule.pageNumber === 'C4') {
			for (var o=0; o<this.pages[k].matchData.length; o++) {
				this.match = this.odds[o];
				this.match.oddXImperial = this.pages[k].matchData[o].OD;
				this.match.oddX = Odds.convertOdds(this.pages[k].matchData[o].OD);
				this.match.oddXFI = this.pages[k].matchData[o].FI;
			}
		}
		if (this.pages[k].preambule.pageNumber === 'C5') {
			for (var p=0; p<this.pages[k].matchData.length; p++) {
				this.match = this.odds[p];
				this.match.odd2Imperial = this.pages[k].matchData[p].OD;
				this.match.odd2 = Odds.convertOdds(this.pages[k].matchData[p].OD);
				this.match.odd2FI = this.pages[k].matchData[p].FI;
			}
		}
	}
}

Odds.prototype.print = function() {
	for (var i=0; i<this.odds.length; i++) {
		console.log('--------------');
		console.log(this.odds[i].name + '   ' + this.odds[i].odd1 + '   ' + this.odds[i].oddX + '   ' + this.odds[i].odd2 + '   ' + this.odds[i].date);
	}
};

Odds.prototype.get = function(cb) {
	cb(this.odds);
};

Odds.startsWith = function(str, starts) {
	var counter = 0;
	for(var j=0;  j<str.length && j<starts.length; j++) {
		if (str.charAt(j) === starts.charAt(j)) {
			counter++;
		} else {
			break;
		}
	}

	if (counter === starts.length) {
		return true;
	}
	return false;
};

Odds.contains = function(str, char) {
	for (var j=0; j<str.length; j++) {
		if (str.charAt(j) === char) {
			return true;
		}
	}

	return false;
};

Odds.convertOdds = function (imperial) {
	var imperialParts = imperial.split('/');
	var chislitel = parseInt(imperialParts[0], 10);
	var znamenatel = parseInt(imperialParts[1], 10);

	return chislitel / znamenatel + 1;
};

module.exports = Odds;