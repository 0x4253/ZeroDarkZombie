function Guide(startx, starty, initRot, audioUrl) {
  this.name = "guide";
  this.audioUrl = audioUrl || "";
  this.loop = false;
  this.x = startx || 1.5;     // current x, y position
  this.y = starty || 1.5;
  this.rot = initRot || -120 * Math.PI / 180;    // the current angle of rotation
  this.circleColor = "rgba(0,100,0,0.3)";
  this.panner = true;
  this.play = false;
}

// makes guide say random sounds that are in globalGuide
// guide will continue to say random sounds until guide.play is false
Guide.prototype.start = function( guide ) {
  if (guide.play) {
    setTimeout( function() {
      var size = 0, key;
      for ( key in globalGuide ) {
          if ( globalGuide.hasOwnProperty( key ) ) size++;
      }
      var rand = Math.floor( Math.random() * size) ;
      size = 0;
      for ( key in globalGuide ) {
        if ( rand == size ) {
          if (guide.play) audioManager.play( globalGuide[ key ] );
        }
        size++;
      }
      guide.start( guide );
    }, 2000 );
  } else {
    audioManager.stop( guide );
  }
}

Guide.prototype.move = function() {
  var newX = player.x;
  var newY = player.y;

  var minDist = Math.min(this.x - newX, this.y - newY);
  var maxDist = Math.max(this.x - newX, this.y - newY);
  var gx = Math.floor(this.x);
  var gy = Math.floor(this.y);
  if ((minDist < 0 && maxDist < 7) || (minDist < 3 && maxDist < 3)  ){
    if (map[gy][gx-1] >= 4){
      this.x -= 1;
    }
    else if (map[gy-1][gx] >= 4){
      this.y -= 1;
    }
  }
  else if (minDist > 5 && maxDist > 5){
    if (map[gy][gx+1] >= 3){
      this.x += 1;
    }
    else if (map[gy+1][gx] >= 3){
      this.y += 1;
    }
  }

  // move all the global guide sound objects
  for ( var soundObjKey in globalGuide ) {
    globalGuide[ soundObjKey ].move( this );
  }
}

Guide.prototype.move2 = function() {
  for (var i = 0 ; i < map[0].length ; i++){
    if ( player.y - 3 > 0 && map[Math.round(player.y - 3)][i] >= 2 ){
      this.x = i;
      this.y = player.y - 3;
      break;
    }
  }

  // move all the global guide sound objects
  for ( var soundObjKey in globalGuide ) {
    globalGuide[ soundObjKey ].move( this );
  }
}


