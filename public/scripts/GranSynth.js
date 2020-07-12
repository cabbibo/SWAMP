function GranSynth( buffer , ctx , output , looping){

    this.buffer = buffer;
    this.ctx = ctx;
    this.output = output;
    this.looping  = looping;
  
    this.playing = false;


    this.playbackRate = .1;
    this.playbackRateRandomness = 0.1;
    this.playbackSpeed = .3;
    this.playbackSpeedRandomness = 1.2;
    this.playbackLocation = 4;
    this.playbackLocationRandomness = .3;
    this.playbackLength = 1;
    this.playbackLengthRandomness = 1;
    this.playbackVolume = 1;
    this.playbackVolumeRandomness = 0;

    this.oTime = G.time;
  
    this.createSource();


    this.linkedSliders = []
  
    this.started  = false;
  }
  
  GranSynth.prototype.createSource = function() {
  
    this.source = this.ctx.createBufferSource();
    this.source.loop = this.looping || false;
  
    //this.source.playbackRate = .1;
  
    this.source.connect( this.output )
  
  
  };
  

  GranSynth.prototype.start = function(){
    this.started = true;
  }
  
  GranSynth.prototype.play = function(){


      this.source.buffer = this.buffer;


      var rate = this.playbackRate + this.playbackRateRandomness * Math.random();
      var location = this.playbackLocation + this.playbackLocationRandomness * Math.random();
      var length = this.playbackLength + this.playbackLengthRandomness * Math.random();
      var volume = this.playbackVolume + this.playbackVolumeRandomness * Math.random();
      
      this.source.playbackRate.value = Math.pow( 1.05946 , rate );
      
  
   //   if( rate ){ this.source.playbackRate.value = Math.pow( 1.05946 , rate ); }
  
   // this.output.gain.value = volume;
   
    
      this.playing = true;
  
      this.source.start(0,location , length);
      this.createSource();
  
      // Recreates source for next time we play;
  
  }
  
  GranSynth.prototype.stop = function(){
    
    this.started = false;
  }
  

  GranSynth.prototype.update = function(){

    if( this.started == true ){

        for( var i = 0; i < this.linkedSliders.length; i++ ){
            this.updateSliderValue(this.linkedSliders[i]);
        }

        if( G.time - this.oTime > this.playbackSpeed + this.playbackSpeedRandomness * Math.random() ){
            this.oTime = G.time;
            this.play();

        }

      }
  }


  GranSynth.prototype.LinkSlider = function( whichObject, slider , minVal , maxVal ){

    this.linkedSliders.push({
        name:whichObject,
        slider:slider,
        minVal:minVal,
        maxVal:maxVal
    })

  }
  
  GranSynth.prototype.updateSliderValue = function(val){
    this[val.name] = val.slider.value * (val.maxVal - val.minVal) + val.minVal 
  }
  