var Odds = require('./read_odds');

var input = fs.readFileSync('../test_data/FlashData.asp.txt', 'utf8');
var readOdds = new Odds(input);
readOdds.print();
