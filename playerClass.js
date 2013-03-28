function Player(startx, starty) {
  this.x : 2,     // current x, y position
  this.y : 2,
  this.dir : 0,    // the direction that the player is turning, either -1 for left or 1 for right.
  this.rot : 0,    // the current angle of rotation
  this.speed : 0,    // is sthe playing moving forward (speed = 1) or backwards (speed = -1).
  this.moveSpeed : 1, // how far (in map units) does the player move each step/update
  this.rotSpeed : 45 * Math.PI / 180,  // how much does the player rotate each step/update (in radians)
  this.eaten: false, //Whether or not the player has been attacked by a zombie
  this.winner: false, //Whether the player has made it to the level's goal
}

Player.prototype.move = function() {
  var moveStep = player.speed * player.moveSpeed; // player will move this far along the current direction vector

  player.rot += player.dir * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)

  // make sure the angle is between 0 and 360 degrees
  while (player.rot < 0) player.rot += twoPI;
  while (player.rot >= twoPI) player.rot -= twoPI;

  var newX = player.x + Math.cos(player.rot) * moveStep;  // calculate new player position with simple trigonometry
  var newY = player.y + Math.sin(player.rot) * moveStep;

  var pos = checkCollision(player.x, player.y, newX, newY, player.moveSpeed, context, false);

  // set new position
  player.x = pos.x; 
  player.y = pos.y;
  
  // Check the win condition
  if (map[Math.floor(newY)][Math.floor(newX)] == 4){
  	//alert("You win!");
  	player.winner = true;
  }
}
