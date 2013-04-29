

// basic global entities
var player = new Player();
var gameGuide = new Guide();

// create one zombie
var NUMBER_OF_ZOMBIES = 0;
var zombie = new Zombie(1, Math.random() * (map[0].length - 4) + 3,
      Math.random() * (map.length - 4) + 3,
      Math.floor(Math.random() * 3));

// arrays to hold variables that need sound and sound updating
var toPlayUrl = [];
var toPlayNames = [];
var toUpdate = [];

// map attributes
var mapWidth = 0;
var mapHeight = 0;
var miniMapScale = 20;

// random
var coneOuterAngle = 120;
var coneInnerAngle = 60;
var twoPI = Math.PI * 2;
var lastWallBump = 0;
var wallDelay = 0;

function footStep() {
  var xblock = Math.floor(player.x);
  var yblock = Math.floor(player.y);
  var floorType = map[yblock][xblock];
  if(floorType == 3)
    audioManager.play(globalLevel.soundObjConcrete);
  else
    audioManager.play(globalLevel.soundObjHay);
}

function wallBump() {
  var now = new Date().getTime();
  if ((lastWallBump == 0) || ((now - lastWallBump) > wallDelay)) {
    lastWallBump = now;
    audioManager.play(globalLevel.soundObjWallBump);
  }
}

function winSound() {
  audioManager.play(globalLevel.soundObjWin);
}

function loseSound() {
  audioManager.play(globalLevel.soundObjLose);
}

function gameCycle() {
  // Check the win condition
  if (map[Math.floor(player.y)][Math.floor(player.x)] == 4) {
    //alert("You win!");
    player.winner = true;
  }

  gameGuide.move2();
  //gameGuide.rot = Math.round(Math.atan2(newY - gameGuide.y, newX - gameGuide.x) * 10) / 10.0; // Guide faces the player
  if (NUMBER_OF_ZOMBIES > 0) {
    zombie.move(player.x, player.y);
    detectZombieCollision();
  }

  audioManager.updateAllPositions(toUpdate);

  updateMiniMap();

  gameOver = (player.winner || player.eaten);
}

// check if the player has run into a wall and move the player if he has
function checkCollision(fromX, fromY, toX, toY, radius, play) {
	var pos = {
		x : fromX,
		y : fromY
	};

	if (toY < 0 || toY >= mapHeight || toX < 0 || toX >= mapWidth) {
		return pos;
  }

	var blockX = Math.floor(toX);
	var blockY = Math.floor(toY);

	if (isBlocking(blockX,blockY)) {
		return pos;
	}

	pos.x = toX;
	pos.y = toY;

  // determine what direction the player is facing
  var rightDown = Math.PI / 4;
  var leftDown = (Math.PI * 3) / 4;
  var leftUp = (Math.PI * 5) / 4;
  var rightUp = (Math.PI * 7) / 4;
  var up = (player.rot < rightUp && player.rot > leftUp);
  var down = (player.rot < leftDown && player.rot > rightDown);
  var left = (player.rot >= leftDown && player.rot <= leftUp);
  var right = (player.rot >= rightUp || player.rot <= rightDown);

	var blockTop = isBlocking(blockX,blockY-1, play && up);
	var blockBottom = isBlocking(blockX,blockY+1, play && down);
	var blockLeft = isBlocking(blockX-1,blockY, play && left);
	var blockRight = isBlocking(blockX+1,blockY, play && right);

	if (blockTop != 0 && toY - blockY < radius) {
		toY = pos.y = blockY + radius;
	}
	if (blockBottom != 0 && blockY+1 - toY < radius) {
		toY = pos.y = blockY + 1 - radius;
	}
	if (blockLeft != 0 && toX - blockX < radius) {
		toX = pos.x = blockX + radius;
	}
	if (blockRight != 0 && blockX+1 - toX < radius) {
		toX = pos.x = blockX + 1 - radius;
	}

	// is tile to the top-left a wall
	if (isBlocking(blockX-1,blockY-1, false) != 0 && !(blockTop != 0 && blockLeft != 0)) {
		var dx = toX - blockX;
		var dy = toY - blockY;
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy)
				toX = pos.x = blockX + radius;
			else
				toY = pos.y = blockY + radius;
		}
	}
	// is tile to the top-right a wall
	if (isBlocking(blockX+1,blockY-1, false) != 0 && !(blockTop != 0 && blockRight != 0)) {
		var dx = toX - (blockX+1);
		var dy = toY - blockY;
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy)
				toX = pos.x = blockX + 1 - radius;
			else
				toY = pos.y = blockY + radius;
		}
	}
	// is tile to the bottom-left a wall
	if (isBlocking(blockX-1,blockY+1, false) != 0 && !(blockBottom != 0 && blockBottom != 0)) {
		var dx = toX - blockX;
		var dy = toY - (blockY+1);
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy)
				toX = pos.x = blockX + radius;
			else
				toY = pos.y = blockY + 1 - radius;
		}
	}
	// is tile to the bottom-right a wall
	if (isBlocking(blockX+1,blockY+1, false) != 0 && !(blockBottom != 0 && blockRight != 0)) {
		var dx = toX - (blockX+1);
		var dy = toY - (blockY+1);
		if (dx*dx+dy*dy < radius*radius) {
			if (dx*dx > dy*dy)
				toX = pos.x = blockX + 1 - radius;
			else
				toY = pos.y = blockY + 1 - radius;
		}
	}

	return pos;
}

function isBlocking(x, y, play) {
  // first make sure that we cannot move outside the boundaries of the level
  if (y < 0 || y > mapHeight || x < 0 || x > mapWidth) {
    if (play)
      wallBump();
    return true;
  }

  // return true if the map block is not 0, ie. if there is a blocking wall.
  if (map[Math.floor(y)][Math.floor(x)] == 1) {
    if (play)
      wallBump();
    return true;
  } else {
    return false;
  }
}

function detectZombieCollision(){
	if (Math.abs(zombie.x - player.x) < 1 && Math.abs(zombie.y - player.y) < 1){
		player.eaten=true;
	}
}

function updateMiniMap() {
  var miniMap = $("#minimap")[0];
  var miniMapObjects = $("#minimapobjects")[0];

  var objectCtx = miniMapObjects.getContext("2d");
  miniMapObjects.width = miniMapObjects.width;

  //draw player sprite
  var img = $("#marine")[0];
  objectCtx.drawImage(img,17,17,35,35,player.x*miniMapScale-10,player.y*miniMapScale-10,35,35);
  
  // draw the player's vision cone
  // castCircle(player, 3, 90, "rgba(0,0,100,0.3)");
  objectCtx.fillStyle = "rgba(0,0,100,0.3)";
  objectCtx.beginPath();
  objectCtx.arc( player.x * miniMapScale,
    player.y * miniMapScale , 3 * miniMapScale,
    player.rot - ( 45 ) / 180 * Math.PI,
    player.rot + ( 45 ) / 180 * Math.PI );
  objectCtx.lineTo( player.x * miniMapScale , player.y * miniMapScale );
  objectCtx.fill();

  if (NUMBER_OF_ZOMBIES > 0) {
    //Draw the zombie
  	z = zombie;
    //draw zombie sprite
    var img = $("#zombie")[0];
    objectCtx.drawImage(img,203,240,44,76,zombie.x*miniMapScale-15,zombie.y*miniMapScale-27,44/1.5,76/1.5);
  }

  //draw guide sprite
  var img = $("#guide")[0];
    objectCtx.drawImage(img,377,3,21,59,gameGuide.x*miniMapScale-5,gameGuide.y*miniMapScale-20,21/1.2,59/1.2);
}

function drawMiniMap() {
  // generate level map

  // draw the topdown view minimap
  var miniMap = $("#minimap")[0];     // the actual map
  var miniMapCtr = $("#minimapcontainer")[0];   // the container div element
  var miniMapObjects = $("#minimapobjects")[0]; // the canvas used for drawing the objects on the map (player character, etc)
  var levelmap = $("#levelmap")[0];

  miniMap.width = mapWidth * miniMapScale;  // resize the internal canvas dimensions
  miniMap.height = mapHeight * miniMapScale;  // of both the map canvas and the object canvas
  miniMapObjects.width = miniMap.width;
  miniMapObjects.height = miniMap.height;

  levelmap.width = miniMap.width;
  levelmap.height = miniMap.height;

  var w = (mapWidth * miniMapScale) + "px"  // minimap CSS dimensions
  var h = (mapHeight * miniMapScale) + "px"
  miniMap.style.width = miniMapObjects.style.width = levelmap.style.width = miniMapCtr.style.width = w;
  miniMap.style.height = miniMapObjects.style.height = levelmap.style.height = miniMapCtr.style.height = h;

  var ctx = miniMap.getContext("2d");

  ctx.fillStyle = "rgb(50, 150, 50)";
  ctx.fillRect(0,0,miniMap.width,miniMap.height);

  // loop through all blocks on the map
  for (var y=0;y<mapHeight;y++) {
    for (var x=0;x<mapWidth;x++) {

      var wall = map[y][x];

      if (wall == 1) { // if there is a wall block at this (x,y) ...
        ctx.fillStyle = "rgb(80,80,80)";
        ctx.fillRect(       // ... then draw a block on the minimap
          x * miniMapScale,
          y * miniMapScale,
          miniMapScale,miniMapScale
        );

      }
      if (wall == 2) { // if there is a wall block at this (x,y) ...
        ctx.fillStyle = "rgb(255, 150, 150)";
        ctx.fillRect(       // ... then draw a block on the minimap
          x * miniMapScale,
          y * miniMapScale,
          miniMapScale,miniMapScale
        );
      }
      if (wall == 3) { // if there is a wall block at this (x,y) ...
        ctx.fillStyle = "rgb(180, 180, 180)";
        ctx.fillRect(       // ... then draw a block on the minimap
          x * miniMapScale,
          y * miniMapScale,
          miniMapScale,miniMapScale
        );
        ctx.stroke();
      }
      if (wall == 4) { // if there is a wall block at this (x,y) ...
        ctx.fillStyle = "rgb(255, 255, 100)";
        ctx.fillRect(       // ... then draw a block on the minimap
          x * miniMapScale,
          y * miniMapScale,
          miniMapScale,miniMapScale
        );
      }
    }
  }

  updateMiniMap();
}