var net = require('net');

var HOST = '127.0.0.1';
var PORT = 9000;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

var messages = [
    {
        subject: "Dinero\n",
        value: "El dinero es bueno\n"
    }, 
    {   subject: "Drogas\n",
        value: "Las drogas son malas\n"
    }
];

var users = [
    {
        name: "Obama\n"
    }, 
    {   name: "Obunga\n",
    }
];

server = net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        var cmd = data.toString();
        console.log('DATA ' + sock.remoteAddress + ': ' + cmd);
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');
        if (cmd == "messages") {
            console.log ("We must send the list of messages....")
			for(i=0;i<messages.length;i++){
				sock.write("Message nº" + i + ": Subject = " + messages[i].subject + ". Message = " + messages[i].value);
			}
        }
		if (cmd == "subjects"){
			console.log ("We must send the list of subjects....")
			for(i=0;i<messages.length;i++){
				sock.write("Subject " + i + ": " + messages[i].subject);
			}
		}
		if(cmd == "users"){
			console.log ("We must send the list of users....")
			for(i=0;i<users.length;i++){
				sock.write("User nº" + i + ": " + users[i].name);
			}
					
		}
        sock.end();
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('Connection closed');
    });
    
});

server.listen(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);
