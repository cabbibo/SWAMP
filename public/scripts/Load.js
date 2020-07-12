
function LoadItAll(){

  

  loadAudio("kick","resources/Kick 008 Vinyl.wav")
  loadAudio("clap","resources/Clap 005.wav")
  loadAudio("snare","resources/Snare 007.wav")
  loadAudio("hihat","resources/HiHat Closed 003 909x.wav")
  


  neededToLoad ++;
  G.shaders.load( 'vs-gold' , 'gold' , 'vertex' );
  G.shaders.load( 'fs-gold' , 'gold' , 'fragment');
 
  G.shaders.load( 'vs-pulseOrb' , 'pulseOrb' , 'vertex');
  G.shaders.load( 'fs-pulseOrb' , 'pulseOrb' , 'fragment');


  
  G.shaders.load( 'vs-tree' , 'tree' , 'vertex');
  G.shaders.load( 'fs-tree' , 'tree' , 'fragment');
  
  
  G.shaders.load( 'vs-face' , 'face' , 'vertex');
  G.shaders.load( 'fs-face' , 'face' , 'fragment');
  
  
    
  G.shaders.load( 'vs-eyes' , 'eyes' , 'vertex');
  G.shaders.load( 'fs-eyes' , 'eyes' , 'fragment');
  
  
  G.shaders.load( 'vs-rod' , 'rod' , 'vertex');
  G.shaders.load( 'fs-rod' , 'rod' , 'fragment');
  
  G.shaders.load( 'vs-handle' , 'handle' , 'vertex');
  G.shaders.load( 'fs-handle' , 'handle' , 'fragment');


  
  G.shaders.load( 'vs-particles' , 'particles' , 'vertex');
  G.shaders.load( 'fs-particles' , 'particles' , 'fragment');



  loadTexture('https://cdn.glitch.com/795da756-4586-4b4b-82a3-eb1104560a1b%2Frough-aluminium.jpg?v=1586368300634',function(texture){
    G.uniforms.t_matcap.value = texture
  });


  

  loadTexture('https://cdn.glitch.com/795da756-4586-4b4b-82a3-eb1104560a1b%2Frough-aluminium.jpg?v=1586368300634',function(texture){
    G.uniforms.t_matcap.value = texture
  });


  loadTexture("resources/vertabrae_Material_Normal.png", function( texture){
    G.textures.vertabraeNormal = texture;
  })

  loadTexture("resources/vertabrae_Material_MetallicSmoothness.png", function( texture){
    G.textures.vertabraeMetallic = texture;
  })

  loadTexture("resources/vertabrae_Material_AlbedoTransparency.png", function( texture){
  G.textures.vertabraeAlbedo = texture;
  })



  loadTexture("resources/Sand Normal Map.jpg", function( texture){
    
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        G.uniforms.t_normal.value = texture;
    })

  loadCubeMap( "resources/mountainCubemap/" ,function(texture){
    G.textures.cubemap = texture;
    G.uniforms.t_cubemap.value = texture
  });



  loadOBJ( "vertBray.obj", function(model){
    console.log( model );
    G.models.vertabrae = model
  })


  loadOBJ( "resources/draggieFace.obj", function(model){
    console.log( model );
    G.models.face = model
  })

}



function loadAudio( name , file ){
  neededToLoad += 1;
  G.audio.buffers[name] = new AudioBuffer( G.audio , file );
  G.audio.buffers[name].addLoadEvent( function(){ onLoad(); });
}

function loadOBJ( file , callback ){

  neededToLoad += 1;

  loader.load( file, function ( object ) {

    object.traverse( function ( child ) {

      if ( child instanceof THREE.Mesh ) {
        callback(child);
      }else{
        //console.log("NOPE");
      }

    });

    onLoad();

  });

}


function loadCubeMap( folder , callback ){
  neededToLoad += 1;
  new THREE.CubeTextureLoader()
	.setPath( folder )
	.load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] , function(t){ 
     callback(t)
    onLoad(); 
  });
}

function loadTexture( file , callback ){

  neededToLoad += 1;

  tLoader.load(file,function(texture){
    onLoad();
    callback(texture);
  });

}


loadDiv = document.getElementById("loadBar")
startButtonDiv = document.getElementById("startButton")
curtainDiv = document.getElementById("curtain")


    startButtonDiv.style.display ="none";

startButtonDiv.addEventListener("mouseup", event => {
startItAll()
});

function startItAll(){
  G.audio.ctx.resume()
  //document.body.requestFullscreen()
  //Tone.context.resume()
    init();
    afterInit();
  curtainDiv.style.display ="none";
}


function onLoad(){
  
  loaded ++;

  loadDiv.style.width = (( loaded / neededToLoad ) * window.innerWidth) + "px" 
  
  //loaderHolder.style.top = .5 * window.innerHeight - .5 * loaderHolder.offsetWidth + "px"

  //console.log("YUPPPPP")

  //document.getElementById("mydiv").offsetWidth

  //console.log( startButton.offsetWidth)
  //startButton.style.left =  .5 * window.innerWidth  - .5 * startButton.offsetWidth+ "px"
  
  if( neededToLoad == loaded ){
    startButtonDiv.style.display ="block";
    startItAll();
    //G.audio.mute.gain.value = 0;
  }
}


     