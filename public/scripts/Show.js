var showTime = 'April 7 2020 9:56:35 GMT-0700';
var showLength = 10000
var showTimeMilli = Date.parse( showTime )

function Show(time, length, stage){
  
  this.stage = stage
  
  this.timeTilStart = 0
  this.timeTilEnd = 0
  this.timeInShow = 0
  
  this.showTime = time;
  this.showTimeLength = length
  this.showTimeMilli = Date.parse( showTime )
  
}


Show.prototype.checkTimeTilShow = function(){
  
}

Show.prototype.start = function(){
  this.playing = true
  scene.add(this.stage)
}

Show.prototype.end = function(){
  this.playing = false 
  scene.remove( this.stage )
}

Show.prototype.update = function(){
  
  this.updateTimes();
  if( this.playing ){
    this.stage.update();
  }
  
}

Show.prototype.updateTimes = function(){
  
  this.showTimeInfo = getTimeRemaining( this.showTimeMilli )
  this.timeTilShow = this.showTimeInfo.t
  
  if( this.timeTilShow > 0 && this.playing == false && this.timeTilShow < showLength ){
    this.start()
  }
  
  if( this.timeTilShow >  showLength && this.playing == true ){
    this.end()
  }
  
  if( this.playing ){
    this.timeInShow = this.timeTilShow / this.showLength
  }
  
}


function getTimeRemaining(endtime){
  var t = endtime - Date.parse(new Date());
  
  var seconds = (t/1000) % 60;
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return t
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds,
  };
}