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
input.DIVISION = 'E1';
input.MATCH_DATE = '2013-12-04';
input.HOME_TEAM = 'West Brom';
input.AWAY_TEAM = 'Manchester United';
input.FT_HOME_GOALS = '';
input.FT_AWAY_GOALS = '';
input.FT_GOALS = '';

/*ms.checkIfMatchExists(input, function(err, rows, fields) {
				if (err) {
	  				throw err;
	  			}

	  			console.log((rows.length > 0) ? true : false); 
			});*/
ms.insertNewMatch(input, function(err, rows, fields) {
				if (err) {
	  				throw err;
	  			}

	  			console.log((rows.length > 0) ? true : false); 
			});
//ms.checkIfMatchExists(input);