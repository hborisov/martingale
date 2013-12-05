var query1 = require('./query')('THIS IS A STATEMNE %1 %2');
var query2 = require('./query')('SELECT * FROM table WHERE username = %1');
query1.setParameter('1', 'value1');
console.log(query1.getQuery()); 
query1.setParameter('2', 'value2');
console.log(query1.getQuery()); 
query2.setParameter('1', 'hbb');
console.log(query2.getQuery());


var ms = require('./mysql_connector')();
var input = {};
input.DIVISION = 'E0';
input.MATCH_DATE = '2013-12-04';
input.HOME_TEAM = 'West Brom';
input.AWAY_TEAM = 'Manchester United';
console.log(ms.checkIfMatchExists(input));
//ms.checkIfMatchExists(input);