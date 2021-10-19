var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var typing = false;
var timeout = undefined;
const usrs = [];
const usrList = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var usr = makeid(5);
  usrList.push(usr);
  var myid = socket.id;
  console.log('User ' + usr + ' connected');
  usrs.push(myid);
  usrs.forEach((element) => {if(element !== myid) {
  		io.sockets.connected[element].emit('chat message', 'User ' + usr + ' logged in.');
  }});
  io.sockets.connected[myid].emit('chat message', 'Welcome to this chatroom. Your username is: ' + usr);
  io.sockets.connected[myid].emit('chat message', 'There is currently ' + usrs.length + ' users in the chat: ' + usrList);
  io.emit('usrid', myid);
  
  socket.on('disconnect', function(){
    console.log(usr + ' disconnected');
    io.emit('chat message', usr + ' disconnected');
    for(let i = 0; i < usrs.length; i++) {
    	if(usrs[i] == myid) {
    		usrs.splice(i,1);
    	}
    }
    for(let i = 0; i < usrList.length; i++) {
    	if(usrList[i] == usr) {
    		usrList.splice(i,1);
    	}
    }
  });
  
  socket.on('typingMessage', function(usrid){
  	usrs.forEach((element) => {if(element !== usrid) {
  		io.sockets.connected[element].emit('showText');
  	}
    });
  });
  
  socket.on('somethingHappened', (usrid) => {
  	console.log(usrid);
  });
  
  socket.on('noLongerTypingMessage', function(usrid){
  	usrs.forEach((element) => {if(element !== usrid) {
  		io.sockets.connected[element].emit('hideText');
  	}
    });
  });
  
  socket.on('chat message', function(msg){
  if(msg !== ''){
    usrs.forEach((element) => {if(element !== myid) {
  	io.sockets.connected[element].emit('chat message', usr + ': ' + msg);
  	}//else{printf();}
    });
    console.log('message: ' + usr + ': ' + msg);
    //io.emit('chat message', usr + ': ' + msg);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
