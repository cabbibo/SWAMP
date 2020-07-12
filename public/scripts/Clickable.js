function Clickable( name , mesh , onMat, offMat){
  Moveable.call(this, name, mesh);
  this.active = false;
  this.hovered = false;
  this.onMat = onMat;
  this.offMat = offMat;
}

Clickable.prototype =Object.create( Moveable.prototype);

Clickable.prototype.receiveData = function(data){
  


  
  if( data.type == "select"){
    this.toggle(data.toggled);
  }
  if(data.type =="first data"){
    this.toggle(!data.toggled);
  }



  
}


Clickable.prototype.sendData = function(type){
  

  var data = {
    name: this.name,
    position:this.position,
    type:type,
    toggled: this.active
  }

  socket.emit('moveable data',data)

}

Clickable.prototype.update = function(){}

Clickable.prototype.toggle = function(toggled){
  if( !toggled ){ this.activate();}else{ this.deactivate();}
}

Clickable.prototype.activate = function(){

  this.active = true;
  this.mesh.material = this.onMat;
  this.mesh.materialNeedsUpdate = true;
  this.onActivate();

}

Clickable.prototype.deactivate = function(){
  this.active = false;
  this.mesh.material = this.offMat;
  this.mesh.materialNeedsUpdate = true;
  this.onDeactivate();
}

Clickable.prototype.onActivate = function(){}
Clickable.prototype.onDeactivate = function(){}

