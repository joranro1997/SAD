var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const typingUsers = [];
const usrs = [];
const usrList = [];
const usrsMap = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var usr = makeid(5);
  usrList.push(usr);
  var myid = socket.id;
  console.log('User ' + usr + ' connected');
  usrs.push(myid);
  usrsMap.push({usr: usr, id: myid});
  usrs.forEach((element) => {if(element !== myid) {
  		io.sockets.connected[element].emit('chat message', 'User ' + usr + ' logged in.');
  }});
  usrs.forEach((element) => {
    io.sockets.connected[element].emit('loggedUsers', usrList);
  });
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
    
    for(let i = 0; i < typingUsers.length; i++) {
    	if(typingUsers[i] == usr) {
    		typingUsers.splice(i,1);
    	}
    }

    usrs.forEach((element) => {
      io.sockets.connected[element].emit('loggedUsers', usrList);
    });
  });
  
  socket.on('keyPressed', () => {
    if(typingUsers.length == 0) {
      typingUsers.push(usr);
        usrs.forEach((element) => {if(element !== myid) {
          io.sockets.connected[element].emit('userStartedTyping', usr);
        }});
        console.log(usr + 'is typing');
    } else {
      for(let i = 0; i < typingUsers.length; i++) {
        if(typingUsers[i] != usr) {
          typingUsers.push(usr);
          usrs.forEach((element) => {if(element !== myid) {
            io.sockets.connected[element].emit('userStartedTyping', usr);
          }});
          console.log(usr + 'is typing');
        } 
      }
    }                                       
  });
    
  socket.on('noLongerTypingMessage', function(){
    for(let i = 0; i < typingUsers.length; i++) {
      if(typingUsers[i] == usr) {
        typingUsers.splice(i,1);
        usrs.forEach((element) => {if(element !== myid) {
          io.sockets.connected[element].emit('userStopedTyping', usr);
        }});
      }
    }
  });
  
  socket.on('chat message', function(msg){
    if(msg !== ''){
      usrs.forEach((element) => {if(element !== myid) {
        io.sockets.connected[element].emit('chat message', usr + ': ' + msg, usr);
      }});
      for(let i = 0; i < typingUsers.length; i++) {
        if(typingUsers[i] == usr) {
          typingUsers.splice(i,1);
        }
      }
      console.log('message: ' + usr + ': ' + msg);
    }
  });

  socket.on('privateMessage', function(value) {
    var msg = value.message;
    var userId = value.userId;
    if(msg !== ''){
      usrsMap.forEach((element) => {
        if(element.id !== myid && element.usr === userId) {
          io.sockets.connected[element.id].emit('chat message', usr + ': ' + msg, usr);
      }});
      for(let i = 0; i < typingUsers.length; i++) {
        if(typingUsers[i] == usr) {
          typingUsers.splice(i,1);
          usrs.forEach((element) => {
            io.sockets.connected[element].emit('userStopedTyping', usr);
          });
        }
      }
      console.log('message: ' + usr + ': ' + msg);
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

