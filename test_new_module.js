var mgs = require('./martin_gale_strategy');
var mg = new mgs();

mg.load(function() {
mg.separateTeamResults();
mg.separateTeams();
console.log(mg.getMatchesWithoutDraw());
process.exit();
});