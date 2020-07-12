

MakeBasicVerticalSlider = function(id,name, parentObj, minHeight, maxHeight,startPos , startingValue ) {
  
  
  var uniforms = {
    time:G.uniforms.time,
    sliderVal:{ type:"f", value:0},
    held:{type:"f",value:0},
    handlePos:{type:"v3",value:new THREE.Vector3()},
    wtl:{type:"m4",value:new THREE.Matrix4()},
    id:{type:"f",value:id},
    t_cubemap: G.uniforms.t_cubemap,
    hovered:{type:"f",value:0}
  }
  
  var handleMaterial = new THREE.MeshBasicMaterial({
    transparent:true,
    opacity:0
  });
  
  
  var rodMaterial = new THREE.ShaderMaterial({
    vertexShader: G.shaders.vs.rod,
    fragmentShader: G.shaders.fs.rod,
    uniforms: uniforms
  });
  
  
  
  
  
  
  var handle = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 3),
    handleMaterial
  );
  
  handle.position.copy( startPos );
  

  var sliderRep = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1,1),
    rodMaterial
  );
  
  sliderRep.scale.set( 1.7, maxHeight + 1, .6);
  //sliderRep.scale.multiplyScalar(1.4);
  
  handle.add(sliderRep);

  var Slider = new Moveable(name, handle);
  Slider.startPosition = new THREE.Vector3(2, 0, 0);
  Slider.startPosition.copy( startPos )
  Slider.sliderRep = sliderRep;
  Slider.parentObj = parentObj;


  Slider.minHeight = minHeight;
  Slider.maxHeight = maxHeight;
  
  Slider.Add = function(){
    this.parentObj.add(this.mesh);
  }
  
  
  Slider.uniforms = uniforms;


  Slider.onHoverOver = function(){
     this.uniforms.hovered.value = 1;
  }.bind( Slider )

  Slider.onHoverOut = function(){
    this.uniforms.hovered.value = 0;
 }.bind( Slider )


 
 Slider.onSelect = function(){
  this.uniforms.held.value = 1;
}.bind( Slider )

Slider.onDeselect = function(){
 this.uniforms.held.value = 0;
}.bind( Slider )



  Slider.rebindFunction("update", function() {
   
    v1.copy(camera.position);
    v2.copy(SERVER.myUser.mousePosition);
    v1.sub(v2);
    v1.normalize();
    v1.multiplyScalar(-this.distanceFromCamera);
    v1.add(camera.position);
    this.parentObj.worldToLocal(v1);

    this.mesh.position.copy(v1);
    this.mesh.position.x = this.startPosition.x;
    this.mesh.position.z = this.startPosition.z;

    var value =
      (this.mesh.position.y - this.minHeight) /
      (this.maxHeight - this.minHeight);

    if (value < 0) {
      value = 0;
    }
    if (value > 1) {
      value = 1;
    }



    
    this.setPositionFromValue( value )
    //this.updateValue(value)
    this.sendData("update");
  });
  
  Slider.setPositionFromValue = function(value){
    
    this.mesh.position.x = this.startPosition.x    
    this.mesh.position.z = this.startPosition.z

    this.mesh.position.y =
      this.minHeight + (this.maxHeight - this.minHeight) * value;
    
    this.value = value;

    this.position.x = this.mesh.position.x;
    this.position.y = this.mesh.position.y;
    this.position.z = this.mesh.position.z;

  }

  Slider.sendData = function(type) {
     
    this.position.x = this.mesh.position.x;
    this.position.y = this.mesh.position.y;
    this.position.z = this.mesh.position.z;
    var data = {
      name: this.name,
      position: this.position,
      type: type,
      value: this.value
    };

    socket.emit("moveable data", data);
  };

  Slider.receiveData = function(data) {

  
    if( data.type == 'first data'){}
    
    this.mesh.position.copy(data.position);
    
    this.position.x = data.position.x;
    this.position.y = data.position.y;
    this.position.z = data.position.z;
    
     if( data.value != this.value || data.type == 'first data'){
       //this.updateValue(data.value);
     }
    
    this.value = data.value;
    
    if(data.type == "hoverOver"){
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

    
    this.updateSliderRep()
    
   
  };
  
  Slider.updateSliderRep = function(){
    
    var halfway = this.maxHeight/2;
    
    this.sliderRep.position.y = halfway - this.position.y;
    this.sliderRep.position.x = 0;
    this.sliderRep.position.z = 0;

 //   this.sliderRep.scale.y = this.position.y * 10;
  }
  
  Slider.updateValue = function(value){
    this.value = value
    if( this.valueMesh ){ this.mesh.remove( this.valueMesh)}
    var stringVal = Math.floor(this.value * 1000)/1000
    stringVal += ""

    this.valueMesh = textMaker.createMesh(stringVal)
    this.valueMesh.scale.set(.3,.3,.3)
    this.valueMesh.position.copy( this.position );
    this.valueMesh.position.y = .4;
    this.valueMesh.position.x = 0;
    this.valueMesh.position.z = 0;
    
    this.mesh.add( this.valueMesh )
    
    
  }
  
  Slider.onEveryUpdate = function(){
   // this.valueMesh.lookAt( camera.position )
     this.updateSliderRep()
    
    var vector = new THREE.Vector3();
    
    uniforms.sliderVal.value = this.value;
    uniforms.wtl.value.getInverse( sliderRep.matrixWorld);
    uniforms.handlePos.value.setFromMatrixPosition( handle.matrixWorld );
  }

  
  Slider.setPositionFromValue( startingValue )
  //Slider.updateValue( startingValue)
  Slider.updateSliderRep()
  return Slider;
};
