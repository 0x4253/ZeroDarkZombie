function Zombie(number, startx, starty, startNumCycles, audioUrl) {
  this.name = "zombie" + number;
  this.audioUrl = audioUrl || "http://cs.unc.edu/~stancill/comp585/zombie-17.wav";
  this.loop = true;
	this.x = startx;
	this.y = starty;
	this.rot = 0;
	this.moveSpeed = 0.5; // How far zombie moves in one move
	this.moveTime = 5; //How many game cycles it takes for the zombie to move
	this.numCycles = startNumCycles ? startNumCycles : 0; //The number of cycles since the zombie last moved
	this.intelligence = 15; //A ratio of how much the zombie follows the player, >1 required
  this.circleColor = "rgba(100,0,0,0.3)";
  this.panner = true;
  this.coneOuterGain = 0.005;
  this.rolloffFactor = 4;
  this.isZombie = true;
}

Zombie.prototype.move = function(playerX, playerY){
	z = this;
	z.numCycles = (z.numCycles + 1) % z.moveTime;
	
  var intelligence;
  if (map[player.y][player.x] == 2) {
    intelligence = 1000; // move randomly
  } else {
    intelligence = this.intelligence;
  }
  if (z.numCycles == 0) {   // only move every once in a while
    var randChase = Math.floor(Math.random() * intelligence);
    if (randChase == 0)
      z.rot = Math.round(Math.atan2(playerY - z.y, playerX - z.x) * 10) / 10.0;
    else
      z.rot += Math.random() * twoPI / 4 - twoPI / 8;
    var moveStep = z.moveSpeed; // zombie will move this far along the current direction vector

    // make sure the angle is between 0 and 360 degrees
    while (z.rot < 0) z.rot += twoPI;
    while (z.rot >= twoPI) z.rot -= twoPI;

    var newX = z.x + Math.cos(z.rot) * moveStep;  // calculate new zombie position with simple trigonometry
    var newY = z.y + Math.sin(z.rot) * moveStep;

    if (isBlocking(newX, newY)) { // Is the zombie allowed to move to the new position?
      z.rot += twoPI / 2; // no, turn him around
      return; // bail out.
    }

    // don't move the zombie if he is moving into a safe zone
    if (map[Math.floor(newY)][Math.floor(newX)] == 2){
      z.rot += twoPI / 2;
      return;
    }

    z.x = newX;
    z.y = newY;
  }
	
}
