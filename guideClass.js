function Guide(startx, starty, initRot, audioUrl) {
  this.name = "guide";
  this.audioUrl = audioUrl || "";
  this.loop = true;
  this.x = startx || 1.5;     // current x, y position
  this.y = starty || 1.5;
  this.rot = initRot || -120 * Math.PI / 180;    // the current angle of rotation
  this.circleColor = "rgba(0,100,0,0.3)";
  this.panner = true;
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

