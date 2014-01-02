var connect = require('connect');

console.log(__dirname);
connect.createServer(
    connect.static(__dirname + '\\webapp')
).listen(8080);