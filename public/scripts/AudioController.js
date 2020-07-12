function AudioController(){


  var AC = window.AudioContext || window.webkitAudioContext;



  this.ctx = Tone.context;// new AC();

  this.mute     = this.ctx.createGain();
  this.analyser = this.ctx.createAnalyser();
  this.gain     = this.ctx.createGain();
  reverbjs.extend(this.ctx);

   var reverbUrl = "/resources/ElvedenHallMarbleHall.m4a";
  this.reverbBig = this.ctx.createReverbFromUrl(reverbUrl, function() {
    this.reverbBig.connect(this.gain);
  }.bind(this));



  var reverbUrl = "/resources/InsidePiano.m4a";
  this.reverbSmall = this.ctx.createReverbFromUrl(reverbUrl, function() {
    this.reverbSmall.connect(this.gain);
  }.bind(this));



  
  G.pingPong = new Tone.PingPongDelay ( .1 , .25 )
  G.pingPong.connect( this.gain );

  G.freeverb = new Tone.Freeverb(10,100);
  G.freeverb.connect( this.gain );

  var reverbUrl = "/resources/ElvedenHallSmokingRoom.m4a";
  this.reverb = this.ctx.createReverbFromUrl(reverbUrl, function() {
    this.reverb.connect(this.gain);
  }.bind(this));
  
  this.gain.connect( this.analyser );
  this.analyser.connect( this.mute );
  
  // If you sound to come out, connect it to the destination
  this.mute.connect( this.ctx.destination );

  this.analyser.frequencyBinCount = 2048;
  this.analyser.array = new Uint8Array( this.analyser.frequencyBinCount );

  
  var data = this.processAudioController();
  
  this.texture = new THREE.DataTexture(
    data,
    data.length / 16,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  
  this.texture.needsUpdate = true;
  
  this.texture.magFilter= THREE.LinearFilter;
  

  this.updateArray = [];
  this.notes = [];
  this.loops = [];


  this.noteInput = this.ctx.createGain();
  this.loopInput = this.ctx.createGain();

  this.noteInput.connect( this.gain );
  this.loopInput.connect( this.gain );


}

AudioController.prototype.update = function(){

  this.analyser.getByteFrequencyData( this.analyser.array );

  this.audioData = this.processAudioController(); 

  this.texture.image.data = this.processAudioController(); 
  this.texture.needsUpdate = true;


  for( var i = 0; i < this.updateArray.length; i++ ){

    this.updateArray[i]();

  }



}


AudioController.prototype.processAudioController = function(){


  var width = this.analyser.frequencyBinCount
 
  var audioTextureData = new Float32Array( width );
 
  for (var i = 0; i < width; i+=4) {
   
    //console.log( this.analyser.array[ i / 4 ] ); 
    audioTextureData[ i+0 ] = this.analyser.array[ (i/4) + 0 ] / 256;
    audioTextureData[ i+1 ] = this.analyser.array[ (i/4) + 1 ] / 256;
    audioTextureData[ i+2 ] = this.analyser.array[ (i/4) + 2 ] / 256;
    audioTextureData[ i+3 ] = this.analyser.array[ (i/4) + 3 ] / 256;
    
  }

  return audioTextureData;

}


AudioController.prototype.addToUpdateArray = function( callback ){

  this.updateArray.push( callback );

}

AudioController.prototype.removeFromUpdateArray = function( callback ){

  for( var i = 0; i< this.updateArray.length; i++ ){

    if( this.updateArray[i] === callback ){

      this.updateArray.splice( i , 1 );
      console.log( 'SPLICED' );

    }

  }

}

