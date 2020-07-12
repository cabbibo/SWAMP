
function doServer(){
  
var myIo = new io();
console.log( myIo)
//myIo.on('connection',(sock) => function(){
  
  console.log("connection")
socket = new io();

  
SERVER = {
  myName:"",
  myID:0,
  numUsers:0,
  allUsers:[],
  userNameDiv: document.getElementById("userNameInput"),  
  userColor1Div: document.getElementById("userColor1Input"),  
  userColor2Div: document.getElementById("userColor2Input"),  
  userMessageDiv: document.getElementById("userMessageInput")

}
  
/*  
    SERVER.userNameDiv.addEventListener("input", event => {
    SERVER.myUser.updateName(event.target.value);
    SERVER.userNameDiv.focus();
  });

  SERVER.userColor1Div.addEventListener("input", event => {
    SERVER.myUser.updateColor1(event.target.value);
    SERVER.userNameDiv.focus();
  });

  SERVER.userColor2Div.addEventListener("input", event => {
    SERVER.myUser.updateColor2(event.target.value);
    SERVER.userNameDiv.focus();
  });

  SERVER.userMessageDiv.addEventListener("input", event => {
    SERVER.myUser.updateMessage(event.target.value);
    SERVER.userNameDiv.focus();
  });

SERVER.userColor1Div.value  = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
SERVER.userColor2Div.value  = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
*/
SERVER.updateInfo = function( newInfo ){
  console.log( newInfo )
}

  lastDataSent = 0
SERVER.update = function(){
   
  SERVER.allUsers.forEach( user => {
    user.Update()
  })
  
  
  // making it so we aren't sending EVERY frame ( though I *reallly* want to )
  if( connected ) {
    if( G.uniforms.time.value - lastDataSent > .1){
      lastDataSent = G.uniforms.time.value
      SERVER.myUser.emitData();
    }
  }
  
}

// Prompt for setting a username
var username;
var connected = false;






var meID = Math.floor( Math.random() * 10000)
var uniqueID = Date.now() + "_" + Math.floor( Math.random() * 1000000)


var userName = userName = "USER_" + meID
socket.emit('add user',{name:userName, id:uniqueID})

SERVER.myName = userName
//SERVER.userNameDiv.value = userName
SERVER.myID = uniqueID

  
  socket.on('moveable data',function(data){
    NewMoveableData( data )
  })

  socket.on('BOOT',function(){
    alert("c'mon you can't do that. Booting in 5 seconds")
    setTimeout(function(){
      window.location.href = "https://www.fastcompany.com/40516598/getting-called-out-for-a-slur-taught-me-how-to-take-criticism"
    },5000)  
  })

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {  
    connected = true;
    SERVER.myUser = MakeUser({ 
      name:SERVER.myName,
      id:SERVER.myID,  
      //color1:SERVER.userColor1Div.value,
      //color2:SERVER.userColor2Div.value,
      //message:SERVER.userMessageDiv.value
    
    })
  });


  socket.on('BOOT',function(){
    
  })

  socket.on('new user data', function(data){
    
    if( SERVER.myUser ){
    if( data.id == SERVER.myUser.id ){
      
      // WHY is this triggering?!?!?
      //console.log("GETTING INFO FROM SELF")
      
    }else{
   
    
    // see if there is any user
    var thisUser = undefined
    
    // whenever we get user data, see if we have a 
    // user corresponding to that data
    SERVER.allUsers.forEach( user =>{
      if( user.id == data.id ) thisUser = user
    })
    
    // if we don't, make a user for them!
    if( thisUser == undefined ) {
      MakeUser(data)
      //moveables.forEach( moveable => moveable.sendData())
    }else{
       thisUser.updateData( data )
    }}
      
    }
    
  })



socket.on('user joined',function( data ){
  console.log("NEW USER")
  if( SERVER.myUser ){
    if( data.id == SERVER.myUser.id ){
      console.log("it MEEEme")
    }else{
      console.log("NOT ME")
      moveables.forEach( moveable => moveable.sendData('first data'))
    }
  }
})




function MakeUser( data ){
  
  var user = new User(data)
  user.Add()
  SERVER.allUsers.push(user)
  
  return user
}


  
SERVER.RemoveUser = function( data ){
  var hasFound = false
  for( var i =0; i < SERVER.allUsers.length; i++ ){
    var u = SERVER.allUsers[i];
    if( u.id == data.id ){
      
      if( hasFound = true ){  }
      hasFound = true
      
      u.Remove();
      SERVER.allUsers.splice(i,1)
      i--;  
    }else{
      //console.log("noone")
    }
    
  }
}
  
  
      console.log("HIIII33333")
  onConnect();
  
//})

}












