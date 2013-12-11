var http = require('http');
var fs = require('fs');
var readline = require('readline');




	//div, date, home team, away team, fi

//var file = fs.createReadStream(DOWNLOAD_DIR + file_name);
var request = http.get("http://www.football-data.co.uk/mmz4281/9697/E0.csv", function(response) {
  var rd = readline.createInterface({
    input: response,
    output: process.stdout,
    terminal: false
  });

  rd.on('line', function(line) {
	var csvValues = line.split(",");
	console.log("Division: " + csvValues[0]);
    console.log("Date: " + csvValues[1]);
    console.log("Home Team: " + csvValues[2]);
    console.log("Away Team: " + csvValues[3]);
    console.log("HT Goals: " + csvValues[4]);
    console.log("AT Goals: " + csvValues[5]);
    console.log("FT Result: " + csvValues[6]);
    console.log("============================");
	});





  //response.pipe(process.stdout);
  /*//console.log(response.toString());
  response.on('data', function (chunk) {
    //console.log(''+chunk);
    data += chunk;
  });*/
});