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

Guide.prototype.move = function() {
  var newX = player.x;
  var newY = player.y;

  var minDist = Math.min(this.x - newX, this.y - newY);
  var maxDist = Math.max(this.x - newX, this.y - newY);
  //console.log("min: " + minDist + "; max: " + maxDist);
  var gx = Math.floor(this.x);
  var gy = Math.floor(this.y);
  if ((minDist < 0 && maxDist < 8) || (minDist < 3 && maxDist < 3)  ){
    if (map[gy][gx+1] >= 3){
      this.x += 1;
    }
    else if (map[gy+1][gx] >= 3){
      this.y += 1;
    }
  }
  else if (minDist > 7 && maxDist > 7){
    if (map[gy][gx-1] >= 3){
      this.x -= 1; 
    }
    else if (map[gy-1][gx] >= 3){
      this.y -= 1;
    }
  }
}

