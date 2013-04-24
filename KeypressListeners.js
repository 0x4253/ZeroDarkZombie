var keyCurrentlyDown = false;

function MenuKeypressListener(event) {
	//$(document).unbind('keypress');
	$(document).keypress(function(event) {
		console.log(event.which);
		event.preventDefault();
		switch (event.which) {
			case 32:
				// Pause/Resume Game
				startLevel(1);
				break;
			case 49:
				// Play Level 1
				startLevel(1);
				break;
			case 50:
				// Play Level 1
				startLevel(2);
				break;
			case 113:
				// quit level
				//gameOver=true;
				//clearLevel();
				break;
		}
	});
}

var twoPI = Math.PI * 2;

// bind keyboard events to game functions (movement, etc)
function LevelKeypressListener() {

  $(document).keydown(function(event) {

		console.log(event.which);

  	if (keyCurrentlyDown == false){
	  	keyCurrentlyDown = true; // disables more than one key from being pressed and from the keydown action from being fired multiple times

	    switch (event.which) { // which key was pressed?

	      case 38: // up, move player forward, ie. increase speed
	        player.moveForward();
	        console.log("move player forward");

	        // Testing wall bump
	        var moveStep = player.speed * player.moveSpeed; // player will move this far along the current direction vector
	        var rot = player.dir * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)
	        while (rot < 0) rot += twoPI;
	        while (rot >= twoPI) rot -= twoPI;
	        var newX = player.x + Math.cos(rot) * moveStep;  // calculate new player position with simple trigonometry
	        var newY = player.y + Math.sin(rot) * moveStep;
	        checkCollision(player.x, player.y, newX, newY, player.moveSpeed, true);
	        break;

	      case 40: // down, move player backward, set negative speed
	        player.moveBackward();
	        break;

	      case 37: // left, rotate player left
	        player.turnLeft();
	        break;

	      case 39: // right, rotate player right
	        player.turnRight();
	        break;

	      case 32:
					// Pause/Resume Game
					togglePause();
					break;
	    }
		}
  });

  $(document).keyup(function(event) {
  	keyCurrentlyDown = false;
  });
}

function RemoveAllListeners(){
	$(document).unbind('keydown');
	$(document).unbind('keyup');
	$(document).unbind('keypress');
}