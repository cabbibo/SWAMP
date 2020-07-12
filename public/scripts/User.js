function User(data) {
  this.id = data.id;
  this.name = data.name;
  
  this.color1 = data.color1;
  this.color2 = data.color2;
  this.message = data.message;

  this.me = false;
  this.lastTimeScene = Date.now();

  this.screenPosition = { x: 0, y: 0 };    
  this.normalizedScreenPos = { x: 0, y: 0 };  

  this.oScreenPosition = { x: 0, y: 0 };

  this.mousePosition = { x: 0, y: 0, z: 0 };
  this.cameraPosition = { x: 0, y: 0, z: 0 };
  this.cameraRotation = { x: 0, y: 0, z: 0, w: 0 };
  this.screenSize = { x: 0, y: 0 };

  this.primaryColor = { x: 0, y: 0, z: 0 };
  this.secondaryColor = { x: 0, y: 0, z: 0 };
  
  
  this.cameraTargetPosition = new Vector3();
  this.cameraTargetRotation = new Quaternion();
  this.mouseTargetPosition = new Vector3();

  this.screenDistance = 1;

  this.mouseDown = 0;

  this.testDiv = document.createElement("div");
  this.testDiv.className = "miniDiv";
  this.testDiv.innerHTML = this.name;

  this.testDiv.style.top = Math.random() * 200 + "px";
  this.testDiv.style.left = Math.random() * 400 + "px";
  this.testDiv.style.pointerEvents = "none";

  this.geo = new THREE.BoxGeometry(1, 1, 1);
  this.mat = new THREE.MeshNormalMaterial();
  

  console.log( parseInt(this.id));
  this.uniforms = {
    dT:       G.uniforms.dt,
    time:     G.uniforms.time,
    t_audio: G.uniforms.t_audio,
    t_matcap: G.uniforms.t_matcap,
    t_normal: G.uniforms.t_normal,
    c_primaryColor: {type:"c",value:new THREE.Color(0xffff00)},
  c_secondaryColor: {type:"c",value:new THREE.Color(0x00ff00)},
    id: { type:"f", value: parseInt(this.id) * .3}

  }

  this.bodyMat = new THREE.ShaderMaterial({
    vertexShader: G.shaders.vs.face,
    fragmentShader: G.shaders.fs.face,
    blending: THREE.AdditiveBlending,
    uniforms: this.uniforms
  });
  
  console.log( G.s)
  
  this.eyeMat = new THREE.ShaderMaterial({
    vertexShader: G.shaders.vs.eyes,
    fragmentShader: G.shaders.fs.eyes,
    uniforms: this.uniforms
  });
  
  
  
  this.cameraRep = new THREE.Object3D();
  
    
var geometry = new THREE.IcosahedronGeometry( .2,2 );
var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );

  this.body = new THREE.Mesh(this.geo,material);
  this.eyeL = new THREE.Mesh(this.geo, this.eyeMat);
  this.eyeR = new THREE.Mesh(this.geo, this.eyeMat);

this.cone = new THREE.Mesh( geometry, this.bodyMat );
  this.cone.rotation.x = Math.PI/2;
  this.cone.position.z = .4;
  this.cone.rotation.y = Math.PI/4;
  

this.body.scale.set( .2 , .2 , .3);

  this.mouseRep = new THREE.Mesh(this.geo, this.bodyMat);

  // dont add representations IF its ourselves!
  if (this.id == SERVER.myID) {
    this.me = true;
    
    this.updateName( this.name );
  }else{
    
    this.eyeL.position.set(0.25, 0, -1);
    this.eyeR.position.set(-0.25, 0, -1);
    this.eyeL.scale.set(.3,.3,.3)  
    this.eyeR.scale.set(.3,.3,.3)


    //this.cameraRep.add(this.body);    
    this.cameraRep.add(this.cone);

    
    
   // this.cameraRep.add(this.eyeL);
    //this.cameraRep.add(this.eyeR);
    
    this.updateName( this.name );    
    this.updateColor1( this.color1 );
    this.updateColor2( this.color2 );


  }
}

User.prototype.Add = function() {
 // if( !this.me ) scene.add(this.nameMesh);
  scene.add(this.cameraRep);
 // scene.add(this.mouseRep);

  //document.body.appendChild(this.testDiv);
};

User.prototype.Remove = function() {
  scene.remove(this.cameraRep);
  scene.remove(this.mouseRep);
  //scene.remove(this.nameMesh);

  //this.testDiv.remove();
};

User.prototype.GetData = function() {
  return {
    name: this.name,
    id: this.id,
    lastTimeScene: Date.now(),
    mousePosition: this.mousePosition,
    screenPosition: this.screenPosition,
    screenSize: this.screenSize,
    cameraPosition: this.cameraPosition,
    cameraRotation: this.cameraRotation,
    color1: this.color1,
    color2: this.color2,
    message: this.message
  };
};

User.prototype.emitData = function() {
  //TODO: only emit if something has changed
  // or if we need to send heartbeat to stay alive
  socket.emit("new user data", this.GetData());
};

User.prototype.updateData = function(data) {
  
  if (data.name != this.name) this.updateName(data.name);
  if (data.color1 != this.color1) this.updateColor1(data.color1);
  if (data.color2 != this.color2) this.updateColor2(data.color2);
  if (data.message != this.message) this.updateMessage(data.message);

  this.testDiv.style.top = data.screenPosition.y + "px";
  this.testDiv.style.left = data.screenPosition.x + "px";

  this.lastTimeScene = data.lastTimeScene;
  
  //this.cameraRep.scale.set(1, data.screenSize.y / data.screenSize.x, 0.1);
  
  if( !this.me ){
    this.cameraTargetPosition.copy(data.cameraPosition);
    this.cameraTargetRotation.copy(data.cameraRotation);

    this.mouseTargetPosition.copy(data.mousePosition);
    
  this.mouseRep.scale.set(0.1, 0.1, 0.1); 
  }else{
    
  this.mouseRep.scale.set(0.04, 0.04, 0.04); 
  }


  


};

User.prototype.lerpValues = function(){
  
  this.cameraRep.position.lerp( this.cameraTargetPosition , .2 );  
  this.cameraRep.quaternion.slerp( this.cameraTargetRotation, .2 );
  
  this.mouseRep.position.lerp( this.mouseTargetPosition ,.2)
  this.mouseRep.quaternion.slerp( this.cameraTargetRotation,.2)
  
    
  v1.copy(this.cameraRep.position);
  v2.set(0,.5,0);
  v1.add(v2);
  
  this.nameMesh.position.copy( v1 );
  this.nameMesh.lookAt( camera.position );

}

User.prototype.selfUpdate = function() {
  
  
  this.cameraPosition.x = camera.position.x;
  this.cameraPosition.y = camera.position.y;
  this.cameraPosition.z = camera.position.z;

  this.cameraRotation.x = camera.quaternion.x;
  this.cameraRotation.y = camera.quaternion.y;
  this.cameraRotation.z = camera.quaternion.z;
  this.cameraRotation.w = camera.quaternion.w;

  this.screenSize.x = window.innerWidth;
  this.screenSize.y = window.innerHeight;
  


  v1.set(
    (this.screenPosition.x / window.innerWidth) * 2 - 1,
    -(this.screenPosition.y / window.innerHeight) * 2 + 1,
    0.5
  );
  
  this.normalizedScreenPos.x = v1.x;  
  this.normalizedScreenPos.y = v1.y;

  

  //console.log( v1 );
  v1.unproject(camera);
  v1.sub(camera.position).normalize();
  v2.copy(camera.position).add(v1.multiplyScalar(this.screenDistance));

  this.mousePosition.x = v2.x;
  this.mousePosition.y = v2.y;
  this.mousePosition.z = v2.z;

  this.mouseRep.position.copy(this.mousePosition);
  this.mouseRep.quaternion.copy(this.cameraRotation)
};

// Right now we are just booting a user
// if we haven't seen them in 5 seconds!
User.prototype.Update = function() {
  if (this.me != true) {
    if (Date.now() - this.lastTimeScene > 5000) {
      SERVER.RemoveUser(this.GetData());
    }
    this.lerpValues()
  } else {
    
    this.selfUpdate();
    this.updateData(this.GetData());
  }
};

User.prototype.updateName = function(name) {
  
  if( this.nameMesh ){scene.remove(this.nameMesh)}
  this.nameMesh = textMaker.createMesh(name);
  this.nameMesh.scale.set(.3,.3,.3)
  this.nameMesh.position.copy( this.cameraRep.position )
//  if( !this.me ) scene.add( this.nameMesh );
  
  this.name = name;
  this.testDiv.innerHTML = this.name;
};

User.prototype.updateColor1 = function(color1) {
  this.color1 = color1;
  this.uniforms.c_primaryColor.value.set(color1);
};

User.prototype.updateColor2 = function(color2) {
  this.color2 = color2;
  this.uniforms.c_secondaryColor.value.set(color2);
};

User.prototype.updateMessage = function(message) {
  this.message = message;
};
