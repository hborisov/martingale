var http = require('http');
var fs = require('fs');

var file = fs.createReadStream(DOWNLOAD_DIR + file_name);
var request = http.get("http://www.football-data.co.uk/mmz4281/9697/E0.csv", function(response) {
  //response.pipe(process.stdout);
  //console.log(response.toString());
  response.on('data', function (chunk) {
    //console.log(''+chunk);
    data += chunk;
  });
});