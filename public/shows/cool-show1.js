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
    color:0xffaaaa,
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
 


  light = new THREE.DirectionalLight(0xffaa44);
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
 var particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: G.shaders.vs.particles,
  fragmentShader: G.shaders.fs.particles,
  uniforms: G.uniforms,
  blending:THREE.AdditiveBlending,
  
  vertexColors: true
});

 var mat = new THREE.PointsMaterial( { size:.1 , vertexColors: true } );
 var particleSystem = new ParticleSystem(particlesMaterial);
 stage.add(particleSystem);





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



var geo = new THREE.PlaneBufferGeometry(1,1);
var mat = new THREE.MeshNormalMaterial();

stage.lilypads = [];

  for( var i = 0; i < 100; i++){
    var m = new THREE.Mesh( geo, mat);
    m.rotation.x = - Math.PI/2;
    m.position.y = -2 + Math.random();
    m.position.x = (Math.random() -.5) * 40;
    m.position.z = (Math.random() -.5) * 40;

    m.scale.multiplyScalar( Math.random()+1);
    m.hoverOver = function(){
      console.log( "WHSI" );
    }

    console.log( m.rotation );
    m.update = function(){

      m.rotation.x += (m.rotation.x + Math.PI/2) * .3;
      
    }

    stage.lilypads.push(m);
    objectControls.add(m);
    scene.add(m);
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

    this.looper.update();
    
  };





  return stage;
  
}
