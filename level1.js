var $ = function(id) { return document.getElementById(id); };
var dc = function(tag) { return document.createElement(tag); };

var lvl1;

var startTime, endTime; // variables to keep time

var player = {
  x : 2,     // current x, y position
  y : 2,
  dir : 0,    // the direction that the player is turning, either -1 for left or 1 for right.
  rot : 120,    // the current angle of rotation
  speed : 0,    // is the playing moving forward (speed = 1) or backwards (speed = -1).
  moveSpeed : 0.2, // how far (in map units) does the player move each step/update
  rotSpeed : 15 * Math.PI / 180,  // how much does the player rotate each step/update (in radians)
  eaten: false, //Whether or not the player has been attacked by a zombie
  winner: false, //Whether the player has made it to the level's goal
}

var gameGuide = {
  x : 1.5,
  y : 1.5,
  rot : -120 * Math.PI / 180
}

// create a variable number of zombies
var zombies = [];
var NUMBER_OF_ZOMBIES = 2;
for (var i = 0 ; i < NUMBER_OF_ZOMBIES ; i++){
	zombies[i] = new Zombie(Math.random()*(map[0].length-4)+3, Math.random()*(map.length-4)+3, Math.floor(Math.random()*3));
}

// map attributes
var mapWidth = 0;
var mapHeight = 0;
var miniMapScale = 20;

// random
var coneOuterAngle = 120;
var coneInnerAngle = 60;
var twoPI = Math.PI * 2;

//setTimeout(initLevel1, 1);
var d = new Date();
var lastFootTime = 0;

function initLevel1() {
  mapWidth = map[0].length;
  mapHeight = map.length;

  if (typeof AudioContext == "function") {
    context = new AudioContext();
  } else if (typeof webkitAudioContext == "function") {
    context = new webkitAudioContext();
  } else {
    alert('Web Audio API is not supported in this browser');
  }

  positionSample = new PositionSampleTest(context);

  bindKeys(context);

  drawMiniMap();
  
	startTime = new Date();

  gameCycle(context);
}

function footStep(context) {
	var rand = Math.floor(Math.random()*10);
	//return a random number up to 10
	var soundNum = rand%5;
	//return a remainder between 0 and 4
	/*switch (soundNum) {

      case 0:
        var urls = ['http://www.unc.edu/home/trivazul/Concrete_steps_1.mp3'];
        break;

      case 1: 
        var urls = ['http://www.unc.edu/home/trivazul/Concrete_Steps_2.mp3'];
        break;

      case 2:
       var urls = ['http://www.unc.edu/home/trivazul/Concrete_Steps_3.mp3'];
        break;

      case 3:
        var urls = ['http://www.unc.edu/home/trivazul/Concete_Steps_4.mp3'];
        break;
        
      case 4:
        var urls = ['http://www.unc.edu/home/trivazul/Concrete_Steps_5.mp3'];
        break;
    } */
    var urls = ['http://upload.wikimedia.org/wikipedia/commons/8/8c/Hay_steps_2.ogg'];
    var xblock = Math.floor(player.x);
    var yblock = Math.floor(player.y);
    var floorType = map[yblock][xblock];
    if(floorType == 3)
    	urls = ['http://upload.wikimedia.org/wikipedia/commons/b/bf/Concrete_Steps_2.ogg'];
    
    var source = context.createBufferSource();
    var loader = new BufferLoader(context, urls, function (buffers) {
        source.buffer = buffers[0];
    });
    loader.load();
    var compressor = context.createDynamicsCompressor();
    var gain = context.createGainNode();
    gain.gain.value = 0.5;
    source.connect(gain);
    var randSpeed = 0.3;
    source.playbackRate.value = 1.5+randSpeed*Math.random();
    gain.connect(compressor);
    compressor.connect(context.destination);
    source.noteOn(0);
  }

var lastWallBump = 0;
var wallDelay = 200;

function wallBump(context) {
  var now = new Date().getTime();
  if ((lastWallBump == 0) || ((now - lastWallBump) > wallDelay)) {
    lastWallBump = now;
    var urls = ['http://cs.unc.edu/~stancill/comp585/bump.wav'];
    var source = context.createBufferSource();
    var loader = new BufferLoader(context, urls, function (buffers) {
        source.buffer = buffers[0];
    });
    loader.load();
    var compressor = context.createDynamicsCompressor();
    var gain = context.createGainNode();
    gain.gain.value = 0.5;
    source.connect(gain);
    var randSpeed = 0.3;
    source.playbackRate.value = 1.5+randSpeed*Math.random();
    gain.connect(compressor);
    compressor.connect(context.destination);
    source.noteOn(0);
  }
}

// bind keyboard events to game functions (movement, etc)
function bindKeys(context) {

  document.onkeydown = function(e) {
    e = e || window.event;

    switch (e.keyCode) { // which key was pressed?

      case 38: // up, move player forward, ie. increase speed
        player.speed = 1;

        // Testing wall bump
        var moveStep = player.speed * player.moveSpeed; // player will move this far along the current direction vector
        rot = player.dir * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)
        while (rot < 0) rot += twoPI;
        while (rot >= twoPI) rot -= twoPI;
        var newX = player.x + Math.cos(rot) * moveStep;  // calculate new player position with simple trigonometry
        var newY = player.y + Math.sin(rot) * moveStep;
        checkCollision(player.x, player.y, newX, newY, player.moveSpeed, context, true);
        break;

      case 40: // down, move player backward, set negative speed
        player.speed = -1;
        break;

      case 37: // left, rotate player left
        player.dir = -1;
        break;

      case 39: // right, rotate player right
        player.dir = 1;
        break;
    }
  }

  document.onkeyup = function(e) {
    e = e || window.event;

    switch (e.keyCode) {
      case 38:
      case 40:
        player.speed = 0; // stop the player movement when up/down key is released
        break;
      case 37:
      case 39:
        player.dir = 0;
        break;
    }
  }
}

function gameCycle(context) {
    move(context);
  	
  	moveZombies();
  	
  	detectZombieCollision();
  	
	var randSpeed2 = .2;
	var interval = 0.32;
	if(Math.abs(player.speed) == 1 && context.currentTime - lastFootTime > 2*interval+randSpeed2*Math.random()){
        footStep(context);
        lastFootTime = context.currentTime;
        }
        
  	updateMiniMap();

  // display sound cones
  castRays(gameGuide, mapWidth*miniMapScale, coneInnerAngle);

  updateConsoleLog();

  if (player.eaten){
  	endTime = new Date();
  	alert("You've been eaten! It took " + (endTime-startTime)/1000 + " seconds.");
  }
  else if(player.winner){
  	endTime = new Date();
  	alert("YOU WIN! You've successfully avoided zombies! It took " + (endTime-startTime)/1000 + " seconds.")
  }
  else {
    setTimeout(function(){gameCycle(context);},1000/15);
  }
}

// display user coordinates
function updateConsoleLog() {
  var miniMapObjects = $("minimapobjects");
  var objectCtx = miniMapObjects.getContext("2d");
  objectCtx.fillText("(" + Math.floor(player.x).toString() + ", " +
   Math.floor(player.y).toString() + ")" + " - " + map[Math.floor(player.y)][Math.floor(player.x)].toString(), 5, 10);
}

function move(context) {
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
  if (map[Math.floor(newY)][Math.floor(newX)]==4){
  	//alert("You win!");
  	player.winner = true;
  }
  
  //move the guide
  var minDist = Math.min(gameGuide.x - newX, gameGuide.y - newY);
  var maxDist = Math.max(gameGuide.x - newX, gameGuide.y - newY);
  //console.log("min: " + minDist + "; max: " + maxDist);
  var gx = Math.floor(gameGuide.x);
  var gy = Math.floor(gameGuide.y);
  if ((minDist < 0 && maxDist < 8) || (minDist<3 && maxDist<3)	){
  	if (map[gy][gx+1]>=3){
  		gameGuide.x += 1;
  	}
  	else if (map[gy+1][gx]>=3){
  		gameGuide.y += 1;
  	}
  }
  else if (minDist > 7 && maxDist > 7){
  	if (map[gy][gx-1]>=3){
  		gameGuide.x -= 1;
  	}
  	else if (map[gy-1][gx]>=3){
  		gameGuide.y -= 1;
  	}
  }
  
  //gameGuide.rot += 6;
  gameGuide.rot = Math.round(Math.atan2(newY-gameGuide.y, newX-gameGuide.x)*10)/10.0;
  //console.log(gameGuide.rot);
  
  positionSample.changePosition(player);
}


function checkCollision(fromX, fromY, toX, toY, radius, context, play) {
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

	var blockTop = isBlocking(blockX,blockY-1, play);
	var blockBottom = isBlocking(blockX,blockY+1, play);
	var blockLeft = isBlocking(blockX-1,blockY, play);
	var blockRight = isBlocking(blockX+1,blockY, play);

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

function moveZombies(){
	var length = zombies.length;
	for(var i = 0 ; i < length ; i++){ 
		zombies[i].move(player.x, player.y);
	}
}

function isBlocking(x,y, play) {
  // first make sure that we cannot move outside the boundaries of the level
  if (y < 0 || y > mapHeight || x < 0 || x > mapWidth) {
    if (play)
      wallBump(context);
    return true;
  }

  // return true if the map block is not 0, ie. if there is a blocking wall.
  if (map[Math.floor(y)][Math.floor(x)] == 1) {
    if (play)
      wallBump(context);
    return true;
  } else {
    return false;
  }
}

function detectZombieCollision(){
	var length = zombies.length;
	for (var i = 0 ; i < length ; i++){
		if (Math.abs(zombies[i].x-player.x) < 0.5 && Math.abs(zombies[i].y-player.y)<0.5){
			player.eaten=true;
		}
	}
}

function updateMiniMap() {
  var miniMap = $("minimap");
  var miniMapObjects = $("minimapobjects");

  var objectCtx = miniMapObjects.getContext("2d");
  miniMapObjects.width = miniMapObjects.width;

  objectCtx.fillRect(   // draw a dot at the current player position
    player.x * miniMapScale - 2,
    player.y * miniMapScale - 2,
    4, 4
  );
  objectCtx.beginPath();
  objectCtx.moveTo(player.x * miniMapScale, player.y * miniMapScale);
  objectCtx.lineTo(
    (player.x + Math.cos(player.rot) * 2) * miniMapScale,
    (player.y + Math.sin(player.rot) * 2) * miniMapScale
  );
  objectCtx.closePath();
  objectCtx.stroke();
  
  //Draw the zombies
  var l = zombies.length
  for (var i = 0 ; i < l ; i++){
  	//console.log("x: " + z.x + "; y: " + z.y);
  	z = zombies[i];
	objectCtx.fillStyle = "red";
  	objectCtx.fillRect(   // draw a dot at the current zombie position
	    z.x * miniMapScale - 2,
	    z.y * miniMapScale - 2,
	    4, 4
	  );
	  objectCtx.beginPath();
	  objectCtx.moveTo(z.x * miniMapScale, z.y * miniMapScale);
	  objectCtx.lineTo(
	    (z.x + Math.cos(z.rot) * 1) * miniMapScale,
	    (z.y + Math.sin(z.rot) * 1) * miniMapScale
	  );
	  
      objectCtx.strokeStyle = 'red';
	  objectCtx.closePath();
	  objectCtx.stroke();
  }

  objectCtx.fillStyle = "black";
  objectCtx.fillRect(   // draw a dot at the current gameGuide position
    gameGuide.x * miniMapScale - 2,
    gameGuide.y * miniMapScale - 2,
    4, 4
  );
  objectCtx.beginPath();
  objectCtx.moveTo(gameGuide.x * miniMapScale, gameGuide.y * miniMapScale);
  objectCtx.lineTo(
    (gameGuide.x + Math.cos(gameGuide.rot) * 2) * miniMapScale,
    (gameGuide.y + Math.sin(gameGuide.rot) * 2) * miniMapScale
  );
  objectCtx.strokeStyle = 'black';
  objectCtx.closePath();
  objectCtx.stroke();
}

function drawMiniMap() {
  // generate level map
  generateLevelOneMap();

  // draw the topdown view minimap
  var miniMap = $("minimap");     // the actual map
  var miniMapCtr = $("minimapcontainer");   // the container div element
  var miniMapObjects = $("minimapobjects"); // the canvas used for drawing the objects on the map (player character, etc)
  var levelmap = $("levelmap");

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

function PositionSampleTest(context) {
    var urls = ["http://upload.wikimedia.org/wikipedia/commons/0/0e/FollowMyVoice2.ogg"];
    //var urls = ["http://upload.wikimedia.org/wikipedia/commons/8/8f/FollowMyVoice.ogg"];
    //var urls = ['http://upload.wikimedia.org/wikipedia/en/f/fc/Juan_Atkins_-_Techno_Music.ogg'];
    //var urls = ['http://upload.wikimedia.org/wikipedia/commons/5/51/Blablablabla.ogg'];
    var source = context.createBufferSource();
    var gain = context.createGainNode();
    gain.gain.value = 0.5;
    this.isPlaying = false;
    var loader = new BufferLoader(context, urls, function (buffers) {
        source.buffer = buffers[0];
    });
    loader.load();
    var canvas = document.getElementById('minimapobjects');
    this.size = {
        width: canvas.width,
        height: canvas.height
    };

    source.loop = true;

    gameGuide.panner = context.createPanner();
    gameGuide.panner.coneOuterGain = 0.005;
    gameGuide.panner.coneOuterAngle = coneOuterAngle;
    gameGuide.panner.coneInnerAngle = coneInnerAngle;
    gameGuide.panner.connect(gain);
    source.connect(gameGuide.panner);
    gain.connect(context.destination);
    source.noteOn(0);
    context.listener.setPosition(player.x, player.y, 0);
    gameGuide.panner.setPosition(gameGuide.x, gameGuide.y, 0);
}
PositionSampleTest.prototype.changePosition = function (position) {
	
    gameGuide.panner.setPosition(gameGuide.x, gameGuide.y, 0); // Change the gameGuide position
    context.listener.setPosition(position.x, position.y, 0);
    context.listener.setOrientation(Math.cos(player.rot),
      Math.sin(player.rot), -1, 0,0,-1);
//    gameGuide.panner.setOrientation(Math.cos(gameGuide.rot),
//      Math.sin(gameGuide.rot), 0);
    gameGuide.panner.setOrientation(Math.cos(gameGuide.rot),
      Math.sin(gameGuide.rot), 0);
};


//
// BufferLoader
//
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function (url, index) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function () {
        loader.context.decodeAudioData(request.response, function (buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
        }, function (error) {
            console.error('decodeAudioData error', error);
        });
    };
    request.onerror = function () {
        alert('BufferLoader: XHR error');
    };
    request.send();
};
BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};



