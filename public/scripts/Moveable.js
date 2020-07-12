var moveables = []

function NewMoveableData(data){
  for( var i = 0; i < moveables.length; i++ ){
    if( moveables[i].name == data.name){
      moveables[i].receiveData( data )
    }
  }
  
}

function Moveable(name,mesh){
  
  objectControls.add( mesh )
  mesh.update = this.update.bind( this )
  mesh.hoverOver = this.hoverOver.bind( this )
  mesh.hoverOut = this.hoverOut.bind( this )
  mesh.select = this.select.bind( this )  
  mesh.deselect = this.deselect.bind( this )

  this.selected = false;
  this.meSelected = false;
  
  this.mesh = mesh
  this.name = name
  this.position = {x:0,y:0,z:0}
  
  this.position.x = this.mesh.position.x  
  this.position.y = this.mesh.position.y
  this.position.z = this.mesh.position.z

  this.isRemotelyHovered = false;
  this.isRemotelySelected = false;

  moveables.push( this )

}

Moveable.prototype.rebindFunction = function( type, newFunction ){
  this.mesh[type] = newFunction.bind(this)
}

Moveable.prototype.sendData = function(type){
  
  var data = {
    name: this.name,
    position:this.position,
    type:type
  }
  
  socket.emit('moveable data',data)

  
}

Moveable.prototype.receiveData = function(data){

  console.log("receiving");
  if(data.type == "update"){
    this.mesh.position.copy( data.position )
    this.position.x = data.position.x
    this.position.y = data.position.y
    this.position.z = data.position.z
  }


  if(data.type == "hoverOver"){
    console.log("HOVER OVER");
    this.onHoverOver();
  }

  if(data.type == "hoverOut"){
    this.onHoverOut();
  }
  
  if( data.type == "select"){
    this.selected = true;
    this.onSelect();
  }
  
  if( data.type == "deselect" ){
    this.selected = false;
    this.onDeselect();
  }
}


Moveable.prototype.hoverOver = function(){
  G.hoveredOver = true;
  this.onHoverOver();
  this.sendData("hoverOver")
}

Moveable.prototype.hoverOut = function(){
  G.hoveredOver = false;
  this.onHoverOut();
  this.sendData("hoverOut")
}

Moveable.prototype.onHoverOver = function(){}
Moveable.prototype.onHoverOut = function(){}

Moveable.prototype.select = function(){
  
  if( this.selected == false ){
    G.moveableSelected = true;
    this.meSelected = true;
    this.selected = true;
    this.distanceFromCamera = v1.copy( camera.position ).sub( this.mesh.position ).length()
    this.sendData("select");
  }
  
  
}

Moveable.prototype.deselect = function(){
  
  if( this.meSelected == true ){
    G.moveableSelected = false;
    this.meSelected = false;
    this.selected = false;
    this.sendData("deselect");
  }
  
}



Moveable.prototype.onSelect = function(){}
Moveable.prototype.onDeselect = function(){}

Moveable.prototype.update = function(){
  
  
  
  console.log("me movin");
  
  if( this.meSelected == true ){
    
    
    console.log("hiiiieewewe")
    v1.copy( camera.position );
    v2.copy( SERVER.myUser.mousePosition )
    v1.sub(v2)
    v1.normalize()
    v1.multiplyScalar( -this.distanceFromCamera )
    v1.add(camera.position)

    this.mesh.position.copy(v1)
    this.position.x = this.mesh.position.x  
    this.position.y = this.mesh.position.y
    this.position.z = this.mesh.position.z

    this.sendData("update")
  }
}


Moveable.prototype.onEveryUpdate = function(){
  
}
