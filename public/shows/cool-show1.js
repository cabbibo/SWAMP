function MakeCoolShow1() {
  var stage = new Object3D();
  
  stage.uniforms = {
    dT:   G.uniforms.dT,
    time: G.uniforms.time,
    t_audio: G.uniforms.t_audio,
    t_matcap: G.uniforms.t_matcap,
    t_normal: G.uniforms.t_normal,
  }


  var treeMat = new THREE.MeshStandardMaterial({
    color:0xffeeaa,
    normalMap: G.uniforms.t_normal.value,
   // metalnessMap : G.textures.vertabraeMetallic,
    metalness:.2,
    roughness:4,
    envMap: G.textures.cubemap,
   // map: G.textures.vertabraeAlbedo,
  
  }) 

  
  






  var globeRad = .6;
  var globePos = new THREE.Vector3( 0 , 2.3, -10);




  var params  = {
    material:              treeMat,
    radius:                 .2,
    height:                 3.5,
    sides:                  6,
    numOf:                 12, 
    randomness:             .2,//.4,
    slices:                 30,
    lightPosition:          new THREE.Vector3().copy( globePos ) ,
    lightSize:              0,
    startingChance:          200.,
    chanceReducer:           1,
    randomnessReducer:       1,
    sliceReducer:            .4,
    numOfReducer:            .9,
    progressionPower:        2.2,
    lengthReduction:         .4,
    maxIterations:           3,
    flattening:              .2,
    maxVerts:      100000,
    upVsOut:.5
  }
  


  var numTrees = 21
  for( var i = 0; i < numTrees; i++ ){


  var a =(i/numTrees) * 4 - 2;

  if( Math.abs(a)< .4){
    a += a * 6;
  }

  var r = Math.random() * 20 + 10;




  tree = new Tree( params );

  tree.position.x = Math.sin(a) * r;// (-Math.random()+.5) * 20;
  tree.position.z = Math.cos(a) * -r;//-(Math.random() *40);
  tree.position.y = 30;
  tree.rotation.x = Math.PI;
 
  tree.scale.multiplyScalar((8));//(6/(Math.abs(a * 4)+.5)) * r/10 );
  scene.add( tree );
  }

  var treeMat = new THREE.MeshStandardMaterial({
    color:0xaaffaa,
    normalMap: G.uniforms.t_normal.value,
   // metalnessMap : G.textures.vertabraeMetallic,
    metalness:0,
    roughness:0,
    envMap: G.textures.cubemap,
   // map: G.textures.vertabraeAlbedo,
  
  }) 

  var params  = {
    material:              treeMat,
    radius:                 .5,
    height:                 2.5,
    sides:                  8,
    numOf:                 10, 
    randomness:             .5,//.4,
    slices:                 30,
    lightPosition:          new THREE.Vector3().copy( globePos ) ,
    lightSize:              0,
    startingChance:          200.,
    chanceReducer:           1,
    randomnessReducer:       1,
    sliceReducer:            1,
    numOfReducer:            1,
    progressionPower:        2.2,
    lengthReduction:         .8,
    maxIterations:           3,
    upVsOut: .3,

    maxVerts:      100000
  }

  tree = new Tree( params );  
  tree.position.x = 0;// (-Math.random()+.5) * 20;
  tree.position.z = -3;//-(Math.random() *40);
  tree.position.y = -6;
  tree.scale.multiplyScalar(4);
  scene.add( tree );
 


  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2;
  stage.add(light);
  light.position.copy( globePos );


  var sphere;



  
 
  var goldMaterial = new THREE.ShaderMaterial({
    vertexShader: G.shaders.vs.gold,
    fragmentShader: G.shaders.fs.gold,
    uniforms: G.uniforms
  });
  
  var geo = new THREE.PlaneGeometry(35, 35, 100,100);

  var floor = new THREE.Mesh(geo, goldMaterial);
  floor.position.set(0, -2, 0);
  floor.rotation.x = -Math.PI/2;
  
  

  //stage.add(floor);



  
  stage.looper = new Looper(G.audio, G.uniforms.time );

  

  
/*



Particles

*/
/* var particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: G.shaders.vs.particles,
  fragmentShader: G.shaders.fs.particles,
  uniforms: G.uniforms,
  blending:THREE.AdditiveBlending,
  
  vertexColors: true
});

 var mat = new THREE.PointsMaterial( { size:.1 , vertexColors: true } );
 var particleSystem = new ParticleSystem(particlesMaterial);
 stage.add(particleSystem);

*/



  sun = new THREE.Vector3(0,-1,0);

  
  var sky = new Sky();
  sky.scale.setScalar( 100 );
  //scene.add( sky );

  var uniforms = sky.material.uniforms;

  uniforms[ 'turbidity' ].value = 10;
  uniforms[ 'rayleigh' ].value = 2;
  uniforms[ 'mieCoefficient' ].value = 0.005;
  uniforms[ 'mieDirectionalG' ].value = 0.8;

  var parameters = {
    inclination: .5,
    azimuth: 0.205
  };


  var pmremGenerator = new THREE.PMREMGenerator( renderer );

  function updateSun() {

    var theta = Math.PI * ( parameters.inclination - 0.5 );
    var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

    sun.x = Math.cos( phi );
    sun.y = Math.sin( phi ) * Math.sin( theta );
    sun.z = Math.sin( phi ) * Math.cos( theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    scene.environment = pmremGenerator.fromScene( sky ).texture;

  }


  var waterGeometry = new THREE.PlaneBufferGeometry( 150 , 150 , 100 , 100 );

  water = new Water(
    waterGeometry,
    {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: new THREE.TextureLoader().load( 'resources/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 100, 100 );
      } ),
      alpha: 1.0,
      sunDirection: new THREE.Vector3(0,-1,0),
      sunColor: 0xffffff,
      waterColor: 0xaaaaaa,
      distortionScale: .3,
      fog: scene.fog !== undefined
    }
  );
  water.material.uniforms[ 'size' ].value = 20;
  water.material.uniforms[ 'speed' ].value = .7;
  water.material.uniforms.time = G.uniforms.time;
  water.position.y = -2;
  water.rotation.x = - Math.PI / 2;

  updateSun();
  scene.add( water );



var geo = G.models.lilypad.geometry;// new THREE.PlaneBufferGeometry(1,1);
var mat = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});


var baseMat = new THREE.MeshStandardMaterial({
  color:0xaaffaa,
 // normalMap: G.uniforms.t_normal.value,
  metalness:1.2,
  roughness:0,
  envMap: G.textures.cubemap,
  side: THREE.DoubleSide

}) 


var hoverMat = new THREE.MeshStandardMaterial({
  color:0xffaaff,
 // normalMap: G.uniforms.t_normal.value,
  metalness:1.2,
  roughness:0,
  envMap: G.textures.cubemap,
  side: THREE.DoubleSide


}) 


stage.lilypads = [];

  for( var i = 0; i < 100; i++){
    var m = new THREE.Mesh( geo, baseMat);
   m.rotation.x = - Math.PI;
   m.rotation.y = Math.random() * 2 * Math.PI;
    m.position.y = -1.9 +  .1*Math.random();
    m.position.x = (Math.random() -.5) * 20;
    m.position.z = (Math.random() -.5) * 20;

    m.baseMat = baseMat;
    m.hoverMat = hoverMat;

    m.scale.multiplyScalar( Math.random() *.4+.2);
    m.hoverOver = function(){
      this.material = this.hoverMat;
    }
    m.hoverOut = function(){
      this.material = this.baseMat;
    }

    //console.log( m.rotation );
    m.update = function(){

      m.rotation.x += (m.rotation.x + Math.PI/2) * .3;
      m.rotation.x += (m.rotation.x + Math.PI/2) * .3;
      
    }

    stage.lilypads.push(m);
    objectControls.add(m);
    scene.add(m);
  }





  stage.dragonflys = [];



  var geo = G.models.dragonflyBod.geometry;// new THREE.PlaneBufferGeometry(1,1);
var mat = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});


var baseMat = new THREE.MeshStandardMaterial({
  color:0xffeeaa,
 // normalMap: G.uniforms.t_normal.value,
  metalness:1.2,
  roughness:0,
  envMap: G.textures.cubemap,
  side: THREE.DoubleSide

}) 


var hoverMat = new THREE.MeshStandardMaterial({
  color:0xffaaff,
  normalMap: G.uniforms.t_normal.value,
  metalness:.2,
  roughness:1,
  envMap: G.textures.cubemap,
  side: THREE.DoubleSide

}) 


stage.dragonflys = [];

  for( var i = 0; i < 30; i++){
    var m = new THREE.Mesh( geo, baseMat);
    var mLeft = new THREE.Mesh(  G.models.dragonflyLeft.geometry, baseMat);
    var mRight = new THREE.Mesh( G.models.dragonflyRight.geometry, baseMat);
    m.idVal = i;
   m.rotation.x = - Math.PI;
   m.rotation.y = Math.random() * 2 * Math.PI;

   m.basePosition = new Vector3();
   m.basePosition.y =   5*Math.random();
   m.basePosition.x = (Math.random() -.5) * 10;
   m.basePosition.z = (Math.random() -.5) * 10;

   m.leftWing = mLeft;
   m.rightWing = mRight;


   m.add(m.leftWing);
   m.add(m.rightWing);
    m.scale.multiplyScalar( Math.random() *.05+.03);
    m.hoverOver = function(){
      console.log("HOVER OVER");
      this.material = hoverMat;
    }
    m.hoverOut = function(){
      console.log("HOVER OUT");
      this.material = baseMat;
    }


    m.leftWing.hoverOver = function(){
      console.log("HOVER OVER");
      this.material = hoverMat;
    }
    m.rightWing.hoverOut = function(){
      console.log("HOVER OUT");
      this.material = baseMat;
    }

    m.oldPosition = new Vector3();

    //console.log( m.rotation );
    m.update = function(){

      this.oldPosition.copy( this.position );
      this.position.x = this.basePosition.x + Math.sin(G.time * 10 * ( .1 +.0013*i*.4) + this.idVal);// (m.rotation.x + Math.PI/2) * .3;
      this.position.y = this.basePosition.y + Math.sin(G.time * 12 * ( .1 +.0013*i*.7) + 4*this.idVal);// (m.rotation.x + Math.PI/2) * .3;
      this.position.z = this.basePosition.z + Math.sin(G.time * 11 * ( .1 +.0013*i*1) + 6*this.idVal);// (m.rotation.x + Math.PI/2) * .3;
     
     this.oldPosition.y = (this.oldPosition.y + this.position.y*2) /3;
      this.lookAt( this.oldPosition );
      this.rotation.y += Math.PI;


      var a = Math.sin(G.time * 40 + this.idVal ) * .1;
      this.leftWing.rotation.z = a;
      this.rightWing.rotation.z = -a;
    }

    stage.dragonflys.push(m);
    objectControls.add(m);
    objectControls.add(m.leftWing);
    objectControls.add(m.rightWing);
    scene.add(m);
  }




  stage.lanterns = [];

  for( var i = 0; i < 14; i ++){
    var lantern = new Lantern();
    lantern.mesh.scale.multiplyScalar( .05 + Math.random() * .1);
    lantern.mesh.position.z = 3 + (Math.random() - .5) * 10;
    lantern.mesh.position.y = 0+ (Math.random() - .5) * 4;;
    lantern.mesh.position.x =  (Math.random() - .5) * 10;
    lantern.mesh.hoverOut = function(){
      console.log("HOVER OUT");
      this.material = baseMat;
    }

    lantern.mesh.hoverOver = function(){
      console.log("HOVER OUT");
      this.material = hoverMat;
    }


    objectControls.add(lantern.mesh);

    lantern.basePosition = new T.Vector3();
    lantern.basePosition.copy( lantern.mesh.position );
    lantern.mesh.rotation.z = Math.random() -.5;
    scene.add(lantern.mesh);
    stage.lanterns[i] = lantern;
  }


  stage.start = function(){

   //// this.granSynth.start();
   this.looper._onNewLoop();
  }



  stage.start();



  stage.update = function() {
    
    for(var i = 0; i < this.numSliders; i++){
      var name = "slider" + (i+1);
      G.uniforms[name].value = G[name].value
      this.loopedGains[name].gain.value = G[name].value
    }

    water.material.uniforms[ 'time' ].value += .1 / 60.0;

    //this.granSynth.update();
    this.lilypads.forEach(element=> element.update() );//le
    this.dragonflys.forEach(element=> element.update() );//le

    this.looper.update();
    
  };





  return stage;
  
}
