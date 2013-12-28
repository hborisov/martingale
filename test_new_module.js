var mgs = require('./martin_gale_strategy');
var mg = new mgs();

mg.load(function() {
mg.separateTeamResults();
mg.separateTeams();
mg.getMatchesWithoutDraw();
process.exit();
});