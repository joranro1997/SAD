var net = require('net');

var connection = net.createConnection({port: 8181, host:'127.0.0.1'}, function(){
	console.log('connection succesful'); 
	connection.write('hey');
});