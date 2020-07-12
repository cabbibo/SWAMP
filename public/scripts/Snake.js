function Snake( id, note , reverb , color ){
  

  this.id = id;

  this.audio = new BufferedAudio( note , G.audio.ctx ,G.audio.reverbSmall, false );//, output , looping){
  this.sections = []
  

  this.oPos = new THREE.Vector3();
  
  this.lastTimeOff = 0;

  
  var offMat = new THREE.MeshStandardMaterial({
    color:color,
    normalMap: G.textures.vertabraeNormal,
    //metalnessMap : G.textures.vertabraeMetallic,
    metalness:1,
    roughness:0,
    envMap: G.textures.cubemap,
    map: G.textures.vertabraeAlbedo,

  })  

  var onMat = new THREE.MeshStandardMaterial({
    color:color,
    //normalMap: G.textures.vertabraeNormal,
   // metalnessMap : G.textures.vertabraeMetallic,
    metalness:1,
    roughness:.1,
    envMap: G.textures.cubemap,
   // map: G.textures.vertabraeAlbedo,

  }) 

  var hoverOverMat = new THREE.MeshStandardMaterial({
    color:color,
    //normalMap: G.textures.vertabraeNormal,
    //metalnessMap : G.textures.vertabraeMetallic,
    metalness:0,
    roughness:1,
    envMap: G.textures.cubemap,
    map: G.textures.vertabraeAlbedo,

  }) 
  


    
  var m = new THREE.Mesh(
    
    G.models.face.geometry,
    onMat
  );

  this.head = new Moveable("snakeHead"+this.id, m); 

  scene.add(m);

  m.scale.set(.2 , .2 , .2)

  



  this.numSections = 16;

    for( var i = 0; i <this.numSections; i++ ){
    var m = new THREE.Mesh(
      new THREE.BoxGeometry(4,5,2),
      new THREE.MeshNormalMaterial()
    );
  
    
    m.position = new THREE.Vector3();
    //m.position.set(Math.random(),Math.random(),Math.random());

   m.visible = false;

    var vert = new THREE.Mesh( 
      G.models.vertabrae.geometry, offMat
    )

    var s = 1-(i / this.numSections)
   // m.scale.set(s,s,s);
    var s = .15;//-(i / this.numSections)
    vert.scale.set( s,s,s );
    vert.oScale = vert.scale.clone();
    vert.add(m);
    scene.add(vert);
    
    this.sections[i] = new Clickable("snake" +this.id+"Bod"+i, m  , onMat , offMat );
    this.sections[i].vert = vert;

    this.sections[i].onActivate = function(){
      this.vert.material = this.onMat
      this.vert.materialNeedsUpdate = true;
    }.bind( this.sections[i] );

    
    this.sections[i].onDeactivate = function(){
      this.vert.material = this.offMat
      this.vert.materialNeedsUpdate = true;
    }.bind( this.sections[i] );


    
    this.sections[i].onHoverOver = function(){
      this.vert.material = hoverOverMat
      this.vert.materialNeedsUpdate = true;
      this.vert.scale.set(.2,.2,.2);
    }.bind( this.sections[i] );

  this.sections[i].onHoverOut = function(){
    if( this.active == true ){
    this.vert.material = onMat
    }else{
      this.vert.material = offMat;
    }
    this.vert.materialNeedsUpdate = true;
    
    this.vert.scale.copy(this.vert.oScale);
  }.bind( this.sections[i] );

  }
  
  this.currentNote = 0;

  
}


Snake.prototype.nextNoteHighlight = function(){
  
  this.sections[this.currentNote].vert.scale.copy( this.sections[this.currentNote].vert.oScale );
  this.currentNote ++;
  this.currentNote %= this.sections.length;
  if( this.sections[this.currentNote].active){ this.audio.play(); }
  this.sections[this.currentNote].vert.scale.set(.2,.2,.2);
}

Snake.prototype.update = function(){
  
  var t = G.uniforms.time.value;

  if( t  - this.lastTimeOff > 10 ){
    this.lastTimeOff = t;
    var total = 0;
    var sects = [];
    for( var i = 0; i < this.sections.length; i++ ){

        if( this.sections[i].active == true ){
          sects[total] = this.sections[i];
          total ++;
        }
    }

    if( total > 0 ){
      var s = sects[ Math.floor( Math.random() * total )];
      console.log("THIS IS MEEEEE");
      console.log( s );
      s.hoverOver();
      s.select();
      s.deselect();
      

    }

  }

 
  if( this.head.selected ){
  
  
  }else{
    this.head.mesh.position.lerp( this.getHeadPosition() ,.03); 
 
  }


  if( this.oPos.distanceTo(this.head.mesh.position) > .0001 ){
  this.head.mesh.lookAt( this.oPos );
  this.head.mesh.rotateY( Math.PI / 2 );
  }
  this.sections[0].vert.position.lerp( this.head.mesh.position , .05);
  this.sections[0].vert.lookAt( this.head.mesh.position );
  this.sections[0].vert.rotateY( Math.PI);
  for( var i = 1; i < this.sections.length; i++ ){
    
    this.sections[i].vert.position.lerp( this.sections[i-1].vert.position , .05);
    this.sections[i].vert.lookAt( this.sections[i-1].vert.position );
    this.sections[i].vert.rotateY( Math.PI);
  }
  

  this.oPos.copy(this.head.mesh.position)
  
}


Snake.prototype.getHeadPosition = function(){
  var t = G.uniforms.time.value * .17;

  var v = (this.id / 5) * 2 * Math.PI 

  var angle = t + v + Math.sin( (this.id+5) * G.uniforms.time.value * .3) * .1;

  var x = Math.sin( angle ) * 3.5  ;
  var y = Math.cos( angle ) * 3.5;
  var z = 2  + 1.5 * Math.sin( v * 3 + G.uniforms.time.value * .1) + .5 * Math.sin( angle * 4 * (Math.sin(v * 10)+1.5) );

  return new THREE.Vector3( x , z,y);
}


