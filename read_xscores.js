var X = require('./read_xscores_results');

var leagues = [['FRANCE', 'LIGUE+1'],
				['FRANCE', 'LIGUE+2'],
				['ENGLAND', 'PREMIER+LEAGUE'],
				['ENGLAND', 'CHAMPIONSHIP'],
				['GERMANY', 'BUNDESLIGA'],
				['GERMANY', '2.+BUNDESLIGA'],
				['ITALY', 'SERIE+A'],
				['ITALY', 'SERIE+B']];

var options = {
  hostname: 'www.xscores.com',
  port: 80,
  method: 'GET'
};

var xscores = {};
var count = {};
count.i = leagues.length;
for (var i=0; i<count.i; i++) {
	options.path = '/soccer/Results.jsp?sport=1&countryName='+ leagues[i][0] +'&leagueName='+ leagues[i][1] +'&sortBy=P&seasonName=2013%2F2014&month=1&result=3';
	xscores = new X();
	xscores.makeRequest(options, function() {
		count.i--;
		
		if(count.i === 1) {
			console.log('end');
		}
	});
}