function Player(startx, starty, initRot) {
  this.name = "player";
  this.isListener = true;  // Needed for a listener
  this.x = startx || 1.5;     // current x, y position
  this.y = starty || 1.5;
  this.dir = 0;    // the direction that the player is turning, either -1 for left or 1 for right.
  this.rot = initRot || 0;    // the current angle of rotation
  this.speed = 0;    // is sthe playing moving forward (speed = 1) or backwards (speed = -1).
  this.moveSpeed = 1; // how far (in map units) does the player move each step/update
  this.rotSpeed = 45 * Math.PI / 180;  // how much does the player rotate each step/update (in radians)
  this.eaten = false; //Whether or not the player has been attacked by a zombie
  this.winner = false; //Whether the player has made it to the level's goal
  this.circleColor = "rgba(0,0,100,0.3)";
}

Player.prototype.move = function() {
  if (player.speed == 1){
    this.moveForward();
  } 
  if (player.speed == -1){
    this.moveBackward();
  } 
  if (player.dir == 1) {
    this.turnLeft();
  }
  if (player.dir == -1) {
    this.turnRight();
  }

  // * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)
}

Player.prototype.turnLeft = function() {
  this.rot -= this.rotSpeed;

  // make sure the angle is between 0 and 360 degrees
  while (this.rot < 0) this.rot += twoPI;
  while (this.rot >= twoPI) this.rot -= twoPI;
}

Player.prototype.turnRight = function() {
  this.rot += this.rotSpeed;

  // make sure the angle is between 0 and 360 degrees
  while (this.rot < 0) this.rot += twoPI;
  while (this.rot >= twoPI) this.rot -= twoPI;
}

Player.prototype.moveForward = function() {
  if ((Math.round(this.rot * 180 / Math.PI) / 45) % 2 == 0){ // If the player is looking straight up, down, left, or right
    var newX = this.x + Math.cos(this.rot) * this.moveSpeed;  // calculate new player position with simple trigonometry
    var newY = this.y + Math.sin(this.rot) * this.moveSpeed;
  }
  else {
    var newX = this.x + Math.cos(this.rot) * this.moveSpeed * Math.SQRT2;  // calculate new player position with simple trigonometry
    var newY = this.y + Math.sin(this.rot) * this.moveSpeed * Math.SQRT2;
  }
  var pos = checkCollision(this.x, this.y, newX, newY, .5, false);
  // set new position
  this.x = pos.x;
  this.y = pos.y;

  // play the footstep sound
  footStep();
}

Player.prototype.moveBackward = function() {
  if ((Math.round(this.rot * 180 / Math.PI) / 45) % 2 == 0){ // If the player is looking straight up, down, left, or right
    var newX = this.x + Math.cos(this.rot) * this.moveSpeed * -1;  // calculate new player position with simple trigonometry
    var newY = this.y + Math.sin(this.rot) * this.moveSpeed * -1;
  }
  else {
    var newX = this.x + Math.cos(this.rot) * this.moveSpeed * -1 * Math.SQRT2;  // calculate new player position with simple trigonometry
    var newY = this.y + Math.sin(this.rot) * this.moveSpeed * -1 * Math.SQRT2;
  }
  var pos = checkCollision(this.x, this.y, newX, newY, .5, false);
  // set new position
  this.x = pos.x;
  this.y = pos.y;
  
  // play the footstep sound
  footStep();
}



