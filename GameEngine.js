var startLevelNumber = 0;
var gameOver = false;
var playing = false;
var levelAlive;
var waitTime;
var distanceFromGuide;
var levelCompleted = 2;
//var map;


function startGame() {
	setTimeout(function() {
		initGameEngine();
		drawMenu();
		GameEngineLoop();
	}, 100);
}

function drawMenu(){
	var miniMap = getid("minimap");     // the actual map
	var ctx = miniMap.getContext("2d");

  	ctx.fillStyle = "rgb(50, 150, 50)";
  	ctx.fillRect(0,0,miniMap.width,miniMap.height);
  	var img=document.getElementById("title");
	ctx.drawImage(img, 0, 0, miniMap.width,miniMap.height);
}

function initGameEngine() {
	MenuKeypressListener();
	levelAlive = false;
}

function GameEngineLoop() {
	if (levelAlive == false && startLevelNumber <= levelCompleted + 1) {
		switch (startLevelNumber) {
			case 1:
				switchToLevel();
				initLevel(Level1);
				levelCycle();
				break;
			case 2:
				switchToLevel();
				initLevel(Level2);
				levelCycle();
				break;
		}
	}

	setTimeout(function() {
		GameEngineLoop();
	}, 100);
}

function clearLevel() {

	if (levelAlive) {
		if (player.winner){
			levelCompleted++;
		}
		console.log("Level is over");
		levelAlive = false;
		startLevelNumber = 0;

		RemoveAllListeners();

		// enable/disable HTML buttons
		for (var i = 1 ; i < levelCompleted + 2 ; i++){ //enable buttons of comepleted levels
			var idname = "#level" + i;
			$(idname).removeAttr("disabled");
		}
		$("#pauseButton").attr("disabled", "disabled");
		$("#quitButton").attr("disabled", "disabled");
		clearMap();
	}

}

function levelCycle() {
	if (playing) {
    document.getElementById("loading").style.display="none";
		gameCycle();
	} else {
    document.getElementById("loading").style.display="block";
	}

	if (gameOver) {
		clearLevel();
	} else {
		setTimeout(function() {
			levelCycle();
		}, 1000 / 10);
	}
}

function switchToLevel() {
	levelAlive = true;
	gameOver = false;
	playing = false;
	clearMap();
}

function initLevel(lvl){
	// initialize map
	lvl.randomizeMap();
	map = lvl.map;
	mapWidth = map[0].length;
	mapHeight = map.length;

	// initialize player/guide/zombie(s)
	player = lvl.player;
	NUMBER_OF_ZOMBIES = lvl.NUMBER_OF_ZOMBIES;
	gameGuide = lvl.gameGuide;

	// initialize sounds for AudioManager
	audioManager.masterGainChanged( 1 );
	for (var i = 0 ; i < NUMBER_OF_ZOMBIES ; i++){
		toPlayUrl.push(zombie.audioUrl);
		console.log("Zombie[" + i + "] audio url: " + zombie.audioUrl);
		toPlayNames.push(zombie.name);
	}
	toPlayUrl.push(gameGuide.audioUrl);
	toPlayNames.push(gameGuide.name);
	var urlMap = [ toPlayNames, toPlayUrl ];
	audioManager.load(urlMap, startSounds);

	// draw map
	drawMiniMap();

	setTimeout(function() {
		LevelKeypressListener();
		startTime = new Date();
	}, lvl.startTimeDelay);
}

function startSounds() {
	console.log("Starting sounds");
  // start playing all sounds
  audioManager.play(gameGuide);
  for (var i = 0 ; i < NUMBER_OF_ZOMBIES ; i++) {
		  audioManager.play(zombie);
	}

	// update all locations to default & add to the update array
	toUpdate = [];
    toUpdate.push(zombie);
	toUpdate.push(gameGuide);
	toUpdate.push(player);
	audioManager.updateAllPositions(toUpdate);

	// once all the sounds are loaded allow player to play
	playing = true;
}

// obsolete function, keep for reference
function pauseGame() {
	button = document.getElementById("pauseButton");
	if (levelAlive) {
		if (button.value == "Pause Game [space]") {
			button.value = "Resume Game [space]";
			audioManager.pauseEffects(); // had to do these opposite b/c of the way
																	 // they display
		} else {
			button.value = "Pause Game [space]";
			audioManager.resumeEffects();
		}
		togglePause();
	}
}

function startLevel(num) {
	startLevelNumber = num;
}


  // clear the canvas
function clearMap(){
	var mm = $('#minimap')[0];
	mm.width = mm.width;
	var mmo = $('#minimapobjects')[0];
	mmo.width = mmo.width;
	var lm = $('#levelmap')[0];
	lm.width = lm.width;
	audioManager.destroyAll();
}

