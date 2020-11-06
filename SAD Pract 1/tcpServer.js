var net = require('net');

var server = net.createServer(function(connectionListener){
	console.log('connected');

	this.getConnections(function(err,count) {
		if(err){
			console.log('error getting connections');
		} else{
			console.log('Connections count ' +count);
		}

	});

	connectionListener.on('end',function(){
		console.log('disconnected');

	});

	connectionListener.write('heyyo\r\n');
});

server.on('error',function(err) {
		console.log('Server error:' + err);
});

server.on('data',function(data) {
		console.log(data.toString());
});

server.listen(8181, function() {
	console.log('server is listenning');
});