var http = require('http');
var cheerio = require('cheerio');
var moment = require('moment');
var F = require('./fixture');
var fixturesApi = new F();

/*var options = {
  hostname: 'www.xscores.com',
  port: 80,
  path: '/soccer/Results.jsp?sport=1&countryName=FRANCE&leagueName=LIGUE+2&sortBy=P&seasonName=2013%2F2014&month=1&result=3',
  method: 'GET'
};*/

function XScores(options) {
	this.options = options;
	this.fixtures = [];
}


XScores.prototype.read = function(res) {
	var data = [];
	var self = this;
	
	res.on('data', function (chunk) {
		data.push(new Buffer(chunk));
	});
	
	res.on('end', function() {
		var buffer = Buffer.concat(data);
		var tableStarts = buffer.toString().search('<table class="dtable">');
		var slicedPage = buffer.toString().substr(tableStarts, buffer.toString().length);
		var tableEnds = slicedPage.search('</table>');
		var table = buffer.toString().substr(tableStarts, tableEnds + 8);

		$ = cheerio.load(table);

		var matchData = [];
		$('tbody').children('tr').each(function(i, elem) {
			if (i !== 0) {
				var fixture=[];
				$(this).children('td').each(function(a,el) {
					if ($(this).attr('class') === 'countryheader') {
						matchData.push($(this).text());
					} else {
						fixture.push($(this).text());
					}
				});
		
				if (fixture.length > 0) {
					matchData.push(fixture);
				}
			}
		});
		
		var o;
		for (var k=0; k<matchData.length; k++) {
			if (typeof matchData[k] === 'string') {
				if (o !== undefined) {
					self.fixtures.push(o);
				}
				o = {};
				o.date = matchData[k];
				o.fixtures = [];
			} else {
				o.fixtures.push(matchData[k]);
			}
		}
		self.fixtures.push(o);

		var counter = {};
		counter.val = 0;

		
		for (var i=0; i<self.fixtures.length; i++) {
			
			for (var j=0; j<self.fixtures[i].fixtures.length; j++) {
				console.log(self.fixtures[i].fixtures[j][3] + '  ' + self.fixtures[i].date + '  ' + self.fixtures[i].fixtures[j][4] + '  ' + self.fixtures[i].fixtures[j][7] + '  ' + self.fixtures[i].fixtures[j][10]);
				var input = {};
				input.DIVISION = self.fixtures[i].fixtures[j][3];
				input.MATCH_DATE = moment(self.fixtures[i].date, 'YYYY-MM-DD').format("YYYY-MM-DD");
				input.HOME_TEAM = self.fixtures[i].fixtures[j][4];
				input.AWAY_TEAM = self.fixtures[i].fixtures[j][7];
				var goals = self.fixtures[i].fixtures[j][11].split('-');
				if (goals.length === 2 && goals[0].length > 0 && goals[1].length > 0) {
					input.FT_HOME_GOALS = goals[0];
					input.FT_AWAY_GOALS = goals[1];
					if (parseInt(goals[0], 10) > parseInt(goals[1], 10)) {
						input.FT_RESULT = 'H';
					} else if (parseInt(goals[0], 10) < parseInt(goals[1], 10)) {
						input.FT_RESULT = 'A';
					} else {
						input.FT_RESULT = 'D';
					}

					input.STATUS = 'Fin';
				} else {
					input.FT_HOME_GOALS = '-1';
					input.FT_AWAY_GOALS = '-1';
					input.FT_RESULT = 'x';
					input.STATUS = 'Sched';
				}
				
				counter.val += 1;
				fixturesApi.addUpdateFixture(input, counter, function(cnt) {
					cnt.val -= 1;
					if(cnt.val === 0) {
						process.exit();
					}
				});

			}
		}

	});
};

XScores.prototype.makeRequest = function() {
	var self = this;
	var req = http.request(this.options, function(res) {
		XScores.prototype.read.call(self, res);
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	req.end();
};

module.exports = XScores;