function Zombie2(number, startx, starty, startNumCycles, audioUrl) {
  this.name = "zombie" + number;
  this.audioUrl = audioUrl || "http://cs.unc.edu/~stancill/comp585/sounds/female_scream.ogg";
  this.loop = false;
  this.x = startx;
  this.y = starty;
  this.rot = 0;
  this.moveSpeed = 0.3; // How far zombie moves in one move
  this.moveTime = 1; //How many game cycles it takes for the zombie to move
  this.numCycles = startNumCycles ? startNumCycles : 0; //The number of cycles since the zombie last moved
  this.intelligence = 25; //A ratio of how much the zombie follows the player, >1 required
  this.circleColor = "rgba(100,0,0,0.3)";
  this.panner = true;
  this.coneOuterGain = 0.005;
  this.rolloffFactor = 1;
  this.isZombie = true;
  this.soundPlaying = false;
  this.rageMode = false;
  this.zombie2SoundObjs = {
    scream: {
      name: "scream",
      url: 'http://cs.unc.edu/~stancill/comp585/sounds/female_scream.ogg',
      x: 0,
      y: 0,
      panner: true,
      move: function( zombie ) {
        this.x = zombie.x;
        this.y = zombie.y;
      }
    },
    old: {
      name: "old",
      url: 'http://cs.unc.edu/~stancill/comp585/zombie-17.wav',
      x: 0,
      y: 0,
      panner: true,
      move: function( zombie ) {
        this.x = zombie.x;
        this.y = zombie.y;
      }
    },
  }
}

Zombie2.prototype.move = function(playerX, playerY){
  z = this;

  z.numCycles = (z.numCycles + 1) % z.moveTime;
    //console.log(z.numCycles);
    z.intelligence = z.intelligence / 1.005;
    console.log(z.intelligence);
 // z.moveSpeed = z.moveSpeed * 1.001;

 var intelligence = z.intelligence;
 var moveSpeed = z.moveSpeed;
 if(z.rageMode){
  intelligence = 5;
  moveSpeed = 1;
}

var distance = Math.sqrt((playerX - z.x)*(playerX - z.x)+(playerY - z.y)*(playerY - z.y));
console.log( distance );

if(!z.soundPlaying){
  if ( distance < 9 ) {
    if( distance < 5){
      setTimeout( function() {
        z.rageMode = false;
      }, audioManager.sounds[ z.zombie2SoundObjs.scream.name ].buffer.duration * 1000 );
      z.rageMode = true;
    }
    setTimeout( function() {
      z.soundPlaying = false;
    }, audioManager.sounds[ z.zombie2SoundObjs.scream.name ].buffer.duration * 1000 );
    z.soundPlaying = true;
    audioManager.play( z.zombie2SoundObjs.scream );
  }
  else{
    setTimeout( function() {
      z.soundPlaying = false;
    }, audioManager.sounds[ z.zombie2SoundObjs.old.name ].buffer.duration * 1000 );
    z.soundPlaying = true;
    audioManager.play( z.zombie2SoundObjs.old );
  }
}

  if (z.numCycles == 0) {   // only move every once in a while
    var randChase = Math.floor(Math.random() * intelligence);
    if (randChase == 0)
      z.rot = Math.round(Math.atan2(playerY - z.y, playerX - z.x) * 10) / 10.0;
    else
      z.rot += Math.random() * twoPI / 4 - twoPI / 8;
    var moveStep = moveSpeed; // zombie will move this far along the current direction vector

    // make sure the angle is between 0 and 360 degrees
    while (z.rot < 0) z.rot += twoPI;
    while (z.rot >= twoPI) z.rot -= twoPI;

    var newX = z.x + Math.cos(z.rot) * moveStep;  // calculate new zombie position with simple trigonometry
    var newY = z.y + Math.sin(z.rot) * moveStep;

    if (isBlocking(newX, newY)) { // is the zombie allowed to move to the new position?
      return; // no, bail out.
    }

    z.x = newX;
    z.y = newY;

    // move all the sound objects
    for ( var soundObjKey in z.zombie2SoundObjs ) {
      z.zombie2SoundObjs[ soundObjKey ].move( this );
    }
  }
}
