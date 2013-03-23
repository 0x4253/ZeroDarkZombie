var $ = function(id) { return document.getElementById(id); };
var dc = function(tag) { return document.createElement(tag); };

var map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

var lvl1;

var player = {
  x : 1.5,     // current x, y position
  y : 1.5,
  dir : 0,    // the direction that the player is turning, either -1 for left or 1 for right.
  rot : 0,    // the current angle of rotation
  speed : 0,    // is the playing moving forward (speed = 1) or backwards (speed = -1).
  moveSpeed : 0.5, // how far (in map units) does the player move each step/update
  rotSpeed : 30 * Math.PI / 180  // how much does the player rotate each step/update (in radians)
}

var soundSource = {
  x : 1.5,
  y : 1.5,
  rot : -120 * Math.PI / 180
}

// map attributes
var mapWidth = 0;
var mapHeight = 0;
var miniMapScale = 20;

// random
var coneOuterAngle = 120;
var coneInnerAngle = 60;
var twoPI = Math.PI * 2;

setTimeout(init, 1);

function generateMap() {
  lvl1 = map.slice(0);

  lvl1[1][1] = 2;  // starting position for player
  var i = 1;
  var j = 1; 
  var totalSpots = map.length + map[0].length-4;

  while (i < map.length-2 && j < map[0].length-2) {
    var rand = Math.floor(Math.random() * totalSpots);
    // if rand is 1 increase i, if rand is 0 increase j
    i += rand < map.length-2 ? 1 : 0;
    j += rand >= map.length-2 ? 1 : 0;
    lvl1[i][j] = 3;
  }

  lvl1[i][j] = 4;
  lvl1[i+1][j] = lvl1[i+1][j]!=0 ? lvl1[i+1][j] : 4;
  lvl1[i-1][j] = lvl1[i-1][j]!=0 ? lvl1[i-1][j] : 4;
  lvl1[i][j+1] = lvl1[i][j+1]!=0 ? lvl1[i][j+1] : 4;
  lvl1[i][j-1] = lvl1[i][j-1]!=0 ? lvl1[i][j-1] : 4;
}

function init() {
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

  gameCycle();
}

function footStep(context) {
    var urls = ['http://upload.wikimedia.org/wikipedia/commons/7/7d/Single_step_wood_floor.ogg'];
    var source = context.createBufferSource();
    var loader = new BufferLoader(context, urls, function (buffers) {
        source.buffer = buffers[0];
    });
    loader.load();
    var compressor = context.createDynamicsCompressor();
    var gain = context.createGainNode();
    gain.gain.value = 1;
    source.connect(gain);
    gain.connect(compressor);
    compressor.connect(context.destination);
    source.noteOn(0);
}
// bind keyboard events to game functions (movement, etc)
function bindKeys(context) {

  document.onkeydown = function(e) {
    e = e || window.event;

    switch (e.keyCode) { // which key was pressed?

      case 38: // up, move player forward, ie. increase speed
        player.speed = 1;
        footStep(context);
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

function gameCycle() {
	
  move();

  updateMiniMap();

  // display sound cones
  castRays(soundSource, mapWidth*miniMapScale, coneInnerAngle);

  updateConsoleLog();

  setTimeout(gameCycle,1000/15);
}

// display user coordinates
function updateConsoleLog() {
  var miniMapObjects = $("minimapobjects");
  var objectCtx = miniMapObjects.getContext("2d");
  objectCtx.fillText("(" + Math.floor(player.x).toString() + ", " +
   Math.floor(player.y).toString() + ")", 5, 10);
}

function move() {
  var moveStep = player.speed * player.moveSpeed; // player will move this far along the current direction vector

  player.rot += player.dir * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)

  // make sure the angle is between 0 and 360 degrees
  while (player.rot < 0) player.rot += twoPI;
  while (player.rot >= twoPI) player.rot -= twoPI;

  var newX = player.x + Math.cos(player.rot) * moveStep;  // calculate new player position with simple trigonometry
  var newY = player.y + Math.sin(player.rot) * moveStep;

  if (isBlocking(newX, newY)) { // are we allowed to move to the new position?
    return; // no, bail out.
  }

  // set new position
  player.x = newX; 
  player.y = newY;
  
  // Check the win condition
  if (map[Math.floor(newY)][Math.floor(newX)]==4){
  	//alert("You win!");
  }
  
  //move the guide
  var minDist = Math.min(soundSource.x - newX, soundSource.y - newY);
  var maxDist = Math.max(soundSource.x - newX, soundSource.y - newY);
  //console.log("min: " + minDist + "; max: " + maxDist);
  var gx = Math.floor(soundSource.x);
  var gy = Math.floor(soundSource.y);
  if ((minDist < 0 && maxDist < 8) || (minDist<3 && maxDist<3)	){
  	if (map[gy][gx+1]>=3){
  		soundSource.x += 1;
  	}
  	else if (map[gy+1][gx]>=3){
  		soundSource.y += 1;
  	}
  }
  else if (minDist > 7 && maxDist > 7){
  	if (map[gy][gx-1]>=3){
  		soundSource.x -= 1;
  	}
  	else if (map[gy-1][gx]>=3){
  		soundSource.y -= 1;
  	}
  }
  
  //soundSource.rot += 6;
  soundSource.rot = Math.round(Math.atan2(newY-soundSource.y, newX-soundSource.x)*10)/10.0;
  //console.log(soundSource.rot);
  
  positionSample.changePosition(player);
}

function isBlocking(x,y) {
  // first make sure that we cannot move outside the boundaries of the level
  if (y < 0 || y > mapHeight || x < 0 || x > mapWidth)
    return true;

  // return true if the map block is not 0, ie. if there is a blocking wall.
  return (map[Math.floor(y)][Math.floor(x)] == 1);
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

  objectCtx.fillRect(   // draw a dot at the current soundSource position
    soundSource.x * miniMapScale - 2,
    soundSource.y * miniMapScale - 2,
    4, 4
  );
  objectCtx.beginPath();
  objectCtx.moveTo(soundSource.x * miniMapScale, soundSource.y * miniMapScale);
  objectCtx.lineTo(
    (soundSource.x + Math.cos(soundSource.rot) * 2) * miniMapScale,
    (soundSource.y + Math.sin(soundSource.rot) * 2) * miniMapScale
  );
  objectCtx.closePath();
  objectCtx.stroke();
}

function drawMiniMap() {
  // generate level map
  generateMap();

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
    var urls = ['http://www.dropbox.com/s/woardfr3dhw7ps9/footsteps_forest_pathway.ogg'];
    //var urls = ['http://upload.wikimedia.org/wikipedia/en/f/fc/Juan_Atkins_-_Techno_Music.ogg'];
    //var urls = ['http://upload.wikimedia.org/wikipedia/commons/5/51/Blablablabla.ogg'];
    var source = context.createBufferSource();
    var gain = context.createGainNode();
    gain.value = 0.2;
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

    soundSource.panner = context.createPanner();
    soundSource.panner.coneOuterGain = 0.005;
    soundSource.panner.coneOuterAngle = coneOuterAngle;
    soundSource.panner.coneInnerAngle = coneInnerAngle;
    soundSource.panner.connect(gain);
    source.connect(soundSource.panner);
    gain.connect(context.destination);
    source.noteOn(0);
    context.listener.setPosition(player.x, player.y, 0);
    soundSource.panner.setPosition(soundSource.x, soundSource.y, 0);
}
PositionSampleTest.prototype.changePosition = function (position) {
	
    soundSource.panner.setPosition(soundSource.x, soundSource.y, 0); // Change the soundSource position
    context.listener.setPosition(position.x, position.y, 0);
    context.listener.setOrientation(Math.cos(player.rot),
      Math.sin(player.rot), -1, 0,0,-1);
//    soundSource.panner.setOrientation(Math.cos(soundSource.rot),
//      Math.sin(soundSource.rot), 0);
    soundSource.panner.setOrientation(Math.cos(soundSource.rot),
      Math.sin(soundSource.rot), 0);
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


// Cast rays
function castRays(source, screenWidth, angle) {
  var stripWidth = 4;
  var fov = angle * Math.PI / 180;
  var numRays = Math.ceil(screenWidth / stripWidth);
  var fovHalf = fov / 2;
  var viewDist = (screenWidth/2) / Math.tan((fov / 2));
  var stripIdx = 0;

  for (var i=0;i<numRays;i++) {
    // where on the screen does ray go through?
    var rayScreenPos = (-numRays/2 + i) * stripWidth;

    // the distance from the viewer to the point on the screen, simply Pythagoras.
    var rayViewDist = Math.sqrt(rayScreenPos*rayScreenPos + viewDist*viewDist);

    // the angle of the ray, relative to the viewing direction.
    // right triangle: a = sin(A) * c
    var rayAngle = Math.asin(rayScreenPos / rayViewDist);

    castSingleRay(
      source.rot + rayAngle,  // add the players viewing direction to get the angle in world space
      stripIdx++,
      source
    );
  }
}

function castSingleRay(rayAngle, stripIdx, source) {

  // first make sure the angle is between 0 and 360 degrees
  rayAngle %= twoPI;
  if (rayAngle < 0) rayAngle += twoPI;

  // moving right/left? up/down? Determined by which quadrant the angle is in.
  var right = (rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25);
  var up = (rayAngle < 0 || rayAngle > Math.PI);

  // only do these once
  var angleSin = Math.sin(rayAngle);
  var angleCos = Math.cos(rayAngle);


  var dist = 0; // the distance to the block we hit
  var xHit = 0;   // the x and y coord of where the ray hit the block
  var yHit = 0;

  var textureX; // the x-coord on the texture of the block, ie. what part of the texture are we going to render
  var wallX;  // the (x,y) map coords of the block
  var wallY;


  // first check against the vertical map/wall lines
  // we do this by moving to the right or left edge of the block we're standing in
  // and then moving in 1 map unit steps horizontally. The amount we have to move vertically
  // is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).

  var slope = angleSin / angleCos;  // the slope of the straight line made by the ray
  var dX = right ? 1 : -1;  // we move either 1 map unit to the left or right
  var dY = dX * slope;    // how much to move up or down

  var x = right ? Math.ceil(source.x) : Math.floor(source.x); // starting horizontal position, at one of the edges of the current map block
  var y = source.y + (x - source.x) * slope;      // starting vertical position. We add the small horizontal step we just made, multiplied by the slope.

  while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
    var wallX = Math.floor(x + (right ? 0 : -1));
    var wallY = Math.floor(y);

    // is this point inside a wall block?
    if (map[wallY][wallX] == 1) {

      var distX = x - source.x;
      var distY = y - source.y;
      dist = distX*distX + distY*distY; // the distance from the player to this point, squared.

      textureX = y % 1; // where exactly are we on the wall? textureX is the x coordinate on the texture that we'll use when texturing the wall.
      if (!right) textureX = 1 - textureX; // if we're looking to the left side of the map, the texture should be reversed

      xHit = x; // save the coordinates of the hit. We only really use these to draw the rays on minimap.
      yHit = y;

      break;
    }
    x += dX;
    y += dY;
  }



  // now check against horizontal lines. It's basically the same, just "turned around".
  // the only difference here is that once we hit a map block,
  // we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
  // If so, we only register this hit if this distance is smaller.

  var slope = angleCos / angleSin;
  var dY = up ? -1 : 1;
  var dX = dY * slope;
  var y = up ? Math.floor(source.y) : Math.ceil(source.y);
  var x = source.x + (y - source.y) * slope;

  while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
    var wallY = Math.floor(y + (up ? -1 : 0));
    var wallX = Math.floor(x);
    if (map[wallY][wallX] == 1) {
      var distX = x - source.x;
      var distY = y - source.y;
      var blockDist = distX*distX + distY*distY;
      if (!dist || blockDist < dist) {
        dist = blockDist;
        xHit = x;
        yHit = y;
        textureX = x % 1;
        if (up) textureX = 1 - textureX;
      }
      break;
    }
    x += dX;
    y += dY;
  }

  if (dist) {
    drawRay(xHit, yHit, source);
  }

}

function drawRay(rayX, rayY, source) {
  var miniMapObjects = $("minimapobjects");
  var objectCtx = miniMapObjects.getContext("2d");

  objectCtx.strokeStyle = "rgba(0,100,0,0.3)";
  objectCtx.lineWidth = 0.5;
  objectCtx.beginPath();
  objectCtx.moveTo(source.x * miniMapScale, source.y * miniMapScale);
  objectCtx.lineTo(
    rayX * miniMapScale,
    rayY * miniMapScale
  );
  objectCtx.closePath();
  objectCtx.stroke();
}
