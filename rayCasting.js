
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

