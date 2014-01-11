var X = require('./read_xscores_results');

var options = {
  hostname: 'www.xscores.com',
  port: 80,
  path: '/soccer/Results.jsp?sport=1&countryName=FRANCE&leagueName=LIGUE+2&sortBy=P&seasonName=2012%2F2013&month=12&result=3',
  method: 'GET'
};

var xscores = new X(options);
xscores.makeRequest();