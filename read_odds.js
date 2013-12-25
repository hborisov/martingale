fs = require('fs');

var data = fs.readFileSync('../test_data/FlashData.asp.txt', 'utf8');

var dataParts = data.split('|');
console.log(dataParts.length);

var pages = [];
var odds = [];
var match;
var temp;

for (var i=0; i<dataParts.length; i++) {
	var page;
	var pageElement = {};
	var elements = dataParts[i].split(';');
	if (startsWith(dataParts[i], "CO")) {
		if (page !== undefined) {
			pages.push(page);
		}
		page = {};
		page.matchData = [];
	}

	for (var p=0; p<elements.length; p++) {
		if (contains(elements[p], '=')) {
			var keyValue = elements[p].split('=');
			pageElement[keyValue[0]] = keyValue[1];
		} else {
			pageElement[elements[p]] = '';
		}
	}

	if (startsWith(dataParts[i], "PA")) {
		//pageElement.pageType = 'MATCH_DATA';
		page.matchData.push(pageElement);
	} else if (startsWith(dataParts[i], "CO")) {
		//pageElement.pageType = 'PREAMBULE';
		var pagenumber = pageElement.ID.substr(0,2);
		pageElement.pageNumber = pagenumber;
		var id = pageElement.ID.substr(4,pageElement.ID.length);
		pageElement.identification = id;

		page.preambule = pageElement;
	}
}
	pages.push(page);


for (var k=0; k<pages.length; k++) {
	//console.log(pages[k].preambule);
	if (pages[k].preambule.pageNumber === 'C1') {
		for (var l=0; l<pages[k].matchData.length; l++) {
			match = {};
			match.date = pages[k].matchData[l].NA;
			match.id = pages[k].matchData[l].ID;
			match.idInt = parseInt(pages[k].matchData[l].ID, 10);
			odds.push(match);
		}
	}
	if (pages[k].preambule.pageNumber === 'C2') {
		for (var l=0; l<pages[k].matchData.length; l++) {
			match = odds[l];
			match.name = pages[k].matchData[l].NA;
			//match.id = pages[k].matchData[l].ID;
			//match.idInt = parseInt(pages[k].matchData[l].ID, 10);
			//odds.push(match);
		}
	}
	if (pages[k].preambule.pageNumber === 'C3') {
		for (var l=0; l<pages[k].matchData.length; l++) {
			match = odds[l];
			match.odd1Imperial = pages[k].matchData[l].OD;
			match.odd1 = convertOdds(pages[k].matchData[l].OD);
			match.odd1FI = pages[k].matchData[l].FI;
			//match.id = pages[k].matchData[l].ID;
			//match.idInt = parseInt(pages[k].matchData[l].ID, 10);
			//odds.push(match);
		}
	}
	if (pages[k].preambule.pageNumber === 'C4') {
		for (var l=0; l<pages[k].matchData.length; l++) {
			match = odds[l];
			match.oddXImperial = pages[k].matchData[l].OD;
			match.oddX = convertOdds(pages[k].matchData[l].OD);
			match.oddXFI = pages[k].matchData[l].FI;
		}
	}
	if (pages[k].preambule.pageNumber === 'C5') {
		for (var l=0; l<pages[k].matchData.length; l++) {
			match = odds[l];
			match.odd2Imperial = pages[k].matchData[l].OD;
			match.odd2 = convertOdds(pages[k].matchData[l].OD);
			match.odd2FI = pages[k].matchData[l].FI;
		}
	}

}
console.log(odds);

function startsWith(str, starts) {
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
}

function contains(str, char) {
	for (var j=0; j<str.length; j++) {
		if (str.charAt(j) === char) {
			return true;
		}
	}

	return false;
}

function convertOdds(imperial) {
	var imperialParts = imperial.split('/');
	var chislitel = parseInt(imperialParts[0], 10);
	var znamenatel = parseInt(imperialParts[1], 10);

	return chislitel / znamenatel + 1;
}