// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));

// Chatroom

console.log("HEY 2")

var numUsers = 0;

var allUsers = [];

var visuals = {
  value1:0,  
  value2:0,
  value3:0,
  value4:0,
  mainColor:{r:0,g:0,b:0},
  secondaryColor:{r:0,g:0,b:0}  

}


var serverData = {}


var bootedAddresses = [];

io.on('connection', function (socket) {
  
 // console.log( serverData )
  
  var addedUser = false;
  
  
  var address = socket.handshake.address;
  console.log( address)
  socket.address = address
  
  for( var i =0; i< bootedAddresses; i++ ){
    if( bootedAddresses[i] == address ){
      BOOT(socket)
    }
    
  }

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (data) {
    
    if (addedUser) return;

    // we store the name in the socket session for this client
    socket.name =  data.name;
    socket.id = data.id
    ++numUsers;
    //allUsers.push(socket)
    addedUser = true;
    
    
    socket.emit('login', {
      name:socket.name,
      id:socket.id,
      numUsers: numUsers,
    });
    
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      name: socket.name,
      id: socket.id,
      numUsers: numUsers,
    });
    
  });
  
  socket.on('i need update', function(data){
    socket.broadcast.emit('need update', data );
  })
  
  socket.on('here is your update', function(data){
    socket.broadcast.emit('here is update', data );
  })
  
  socket.on('user name updated', function(data){
    socket.broadcast.emit('user name updated', data );
  })
  
  socket.on('new user data', function(data){
    socket.broadcast.emit('new user data', data );
  })
  
  socket.on('moveable data', function(data){
    serverData[data.name] = data
    socket.broadcast.emit('moveable data', data );
  })
  
  
  
  /*
  
    Send all of the saved server data
  
  */
  
  Object.keys(serverData).forEach(function (item) {
    console.log(item); // key
    socket.emit('moveable data',serverData[item]); // value
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      
      --numUsers;

      for( var i = 0; i < allUsers.length; i++ ){
        i--;
      }
      
      //lUsers.remove(socket)
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        name: socket.name,        
        id: socket.id,
        numUsers: numUsers,
      });
      
      
    }
  });
});

function BOOT(socket,address){
  socket.emit("BOOT")
  bootedAddresses.push( address)
}



