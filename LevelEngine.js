//var getid = function(id) { return document.getElementById(id); };
var getid = function(id) { return document.getElementById(id); };
var dc = function(tag) { return document.createElement(tag); };

var lvl1;
var startTime, endTime; // variables to keep time
var gameOver = false;
var playing = false;
var map = getBlankMap();

// basic entities
var player = new Player();
var gameGuide = new Guide();
var audioManager = new AudioManager();

// create one zombie
var NUMBER_OF_ZOMBIES = 0;
var zombie = new Zombie(1, Math.random() * (map[0].length - 4) + 3,
      Math.random() * (map.length - 4) + 3,
      Math.floor(Math.random() * 3));

// create soundObjs that are always used
var soundObjHay = {
  name: "hay",
  url: 'http://www.cs.unc.edu/~stancill/comp585/Hay_steps_2.ogg'
}
var soundObjConcrete = {
  name: "concrete",
  url: 'http://www.cs.unc.edu/~stancill/comp585/Concrete_Steps_2.ogg'
}
var soundObjWallBump = {
  name: "wallBump",
  url: 'http://cs.unc.edu/~stancill/comp585/bump.mp3'
}
var soundObjWin = {
  name: "win",
  url: 'http://cs.unc.edu/~stancill/comp585/tada.wav'
}
var soundObjLose = {
  name: "lose",
  url: 'http://cs.unc.edu/~stancill/comp585/gameover.ogg'
}

// arrays to hold variables that need sound and sound updating
var toPlayUrl = [soundObjHay.url,
                 soundObjConcrete.url,
                 soundObjWallBump.url,
                 soundObjWin.url,
                 soundObjLose.url]
var toPlayNames = [soundObjHay.name,
                   soundObjConcrete.name,
                   soundObjWallBump.name,
                   soundObjWin.name,
                   soundObjLose.name]
var toUpdate = [];

// map attributes
var mapWidth = 0;
var mapHeight = 0;
var miniMapScale = 20;

// random
var coneOuterAngle = 120;
var coneInnerAngle = 60;
var twoPI = Math.PI * 2;

var d = new Date();
var lastFootTime = 0;


function footStep() {
  var xblock = Math.floor(player.x);
  var yblock = Math.floor(player.y);
  var floorType = map[yblock][xblock];
  if(floorType == 3)
    audioManager.play(soundObjConcrete);
  else
    audioManager.play(soundObjHay);
}

var lastWallBump = 0;
var wallDelay = 200;

function wallBump() {
  var now = new Date().getTime();
  if ((lastWallBump == 0) || ((now - lastWallBump) > wallDelay)) {
    lastWallBump = now;
    audioManager.play(soundObjWallBump);
  }
}

function winSound() {
  audioManager.play(soundObjWin);
}

function loseSound() {
  audioManager.play(soundObjLose);
}

function togglePause() {
  if (playing == true){
    playing = false;
    audioManager.pauseEffects();
  } else {
    audioManager.resumeEffects();
    playing = true;
  }
}

// Need to add support for more levels
// Need more structure to code


function gameCycle() {
  move();

  audioManager.updateAllPositions(toUpdate);

  detectZombieCollision();

	var randSpeed2 = .2;
	var interval = 0.32;
	if(Math.abs(player.speed) == 1 &&
      audioManager.audioContext.currentTime - lastFootTime > 2 * interval + randSpeed2 * Math.random()) {
    footStep();
    lastFootTime = audioManager.audioContext.currentTime;
  }

  updateMiniMap();

  // display sound cones
  castCircle(gameGuide, 3, 90, "rgba(0,100,0,0.3)");
  castCircle(player, 3, 90, "rgba(0,0,100,0.3)");
  castCircle(zombie, 3, 90, "rgba(100,0,0,0.3)");

  updateConsoleLog();

  if (player.eaten){
    audioManager.stopAll();
    loseSound();
  	endTime = new Date();
    outputToScreen("You've been eaten! It took " +
        (endTime-startTime)/1000 + " seconds.");
    gameOver = true;
    audioManager.loadAndPlay("You've been eaten! It took " +
        (endTime-startTime)/1000 + " seconds.");
  }
  else if(player.winner){
    audioManager.stopAll();
    winSound();
  	endTime = new Date();
  	outputToScreen("YOU WIN! You've successfully avoided zombies! It took " +
        (endTime-startTime)/1000 + " seconds.");
    gameOver = true;
    console.log(millisecondsToStr( endTime - startTime ));
    audioManager.loadAndPlay("YOU WIN! You've successfully avoided zombies! It took " +
        millisecondsToStr( endTime - startTime ));
  }
}

function getDuration(timeMillis){
    var units = [
        {label:"millis",    mod:1000,},
        {label:"seconds",   mod:60,},
        {label:"minutes",   mod:60,},
        {label:"hours",     mod:24,},
        {label:"days",      mod:7,},
        {label:"weeks",     mod:52,},
    ];
    var duration = new Object();
    var x = timeMillis;
    for (i = 0; i < units.length; i++){
        var tmp = x % units[i].mod;
        duration[units[i].label] = tmp;
        x = (x - tmp) / units[i].mod
    }
    return duration;
}

function millisecondsToStr( time ) {
  var duration = getDuration( time );
  var str = "";
  if (duration.weeks > 0)
    str += duration.weeks + " weeks, ";
  if (duration.days > 0)
    str += duration.days + " days, ";
  if (duration.hours > 0)
    str += duration.hours + " hours, ";
  if (duration.minutes > 0)
    str += duration.minutes + " minutes, ";
  if (duration.minutes > 0)
    str += " and "
  if (duration.seconds > 0)
    str += duration.seconds + " seconds, ";
  // if (duration.millis > 0)
  //   str += duration.millis + " milliseconds";
  return str;
}

// display user coordinates
function updateConsoleLog() {
  var miniMapObjects = getid("minimapobjects");
  var objectCtx = miniMapObjects.getContext("2d");
  objectCtx.fillText("(" + Math.floor(player.x).toString() + ", " +
  Math.floor(player.y).toString() + ")" + " - " + map[Math.floor(player.y)][Math.floor(player.x)].toString(), 5, 10);
}

function outputToScreen(string) {
  var miniMapObjects = getid("minimapobjects");
  var objectCtx = miniMapObjects.getContext("2d");
  objectCtx.font="20px Georgia";
  objectCtx.fillText(string, 5, (map[0].length / 2) * miniMapScale);
}

function move() {
  // newX and newY are used to update the positions for the guide and the zombie
  var newX = player.x;
  var newY = player.y;

  // Check the win condition
  if (map[Math.floor(newY)][Math.floor(newX)] == 4) {
  	//alert("You win!");
  	player.winner = true;
  }

  //move the guide
  var minDist = Math.min(gameGuide.x - newX, gameGuide.y - newY);
  var maxDist = Math.max(gameGuide.x - newX, gameGuide.y - newY);
  //console.log("min: " + minDist + "; max: " + maxDist);
  var gx = Math.floor(gameGuide.x);
  var gy = Math.floor(gameGuide.y);
  if ((minDist < 0 && maxDist < 8) || (minDist < 3 && maxDist < 3)	){
  	if (map[gy][gx+1] >= 3){
  		gameGuide.x += 1;
  	}
  	else if (map[gy+1][gx] >= 3){
  		gameGuide.y += 1;
  	}
  }
  else if (minDist > 7 && maxDist > 7){
  	if (map[gy][gx-1] >= 3){
  		gameGuide.x -= 1;
  	}
  	else if (map[gy-1][gx] >= 3){
  		gameGuide.y -= 1;
  	}
  }

  //gameGuide.rot += 6;
  gameGuide.rot = Math.round(Math.atan2(newY - gameGuide.y, newX - gameGuide.x) * 10) / 10.0;
  //console.log(gameGuide.rot);

  zombie.move(player.x, player.y);

}

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
	if (Math.abs(zombie.x - player.x) < 0.5 && Math.abs(zombie.y - player.y) < 0.5){
		player.eaten=true;
	}
}

function updateMiniMap() {
  var miniMap = getid("minimap");
  var miniMapObjects = getid("minimapobjects");

  var objectCtx = miniMapObjects.getContext("2d");
  miniMapObjects.width = miniMapObjects.width;

  objectCtx.fillRect(   // draw a dot at the current player position
    player.x * miniMapScale - 2,
    player.y * miniMapScale - 2,
    4, 4
  );
  //draw player sprite
  var img=getid("marine");
  objectCtx.drawImage(img,17,17,35,35,player.x*miniMapScale-10,player.y*miniMapScale-10,35,35);

  //Draw the zombie
	z = zombie;
  //draw zombie sprite
  var img=getid("zombie");
  objectCtx.drawImage(img,203,240,44,76,zombie.x*miniMapScale-15,zombie.y*miniMapScale-27,44/1.5,76/1.5);

  objectCtx.fillStyle = "red";
  objectCtx.fillRect(   // draw a dot at the current zombie position
    z.x * miniMapScale - 2,
    z.y * miniMapScale - 2,
    4, 4
  );

  objectCtx.fillStyle = "black";
  objectCtx.fillRect(   // draw a dot at the current gameGuide position
    gameGuide.x * miniMapScale - 2,
    gameGuide.y * miniMapScale - 2,
    4, 4
  );
  //draw guide sprite
  var img=getid("guide");
    objectCtx.drawImage(img,377,3,21,59,gameGuide.x*miniMapScale-5,gameGuide.y*miniMapScale-20,21/1.2,59/1.2);
}

function drawMiniMap() {
  // generate level map

  // draw the topdown view minimap
  var miniMap = getid("minimap");     // the actual map
  var miniMapCtr = getid("minimapcontainer");   // the container div element
  var miniMapObjects = getid("minimapobjects"); // the canvas used for drawing the objects on the map (player character, etc)
  var levelmap = getid("levelmap");

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