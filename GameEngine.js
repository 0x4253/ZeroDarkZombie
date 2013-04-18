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
		GameEngineLoop();
	}, 100);
}

function initGameEngine() {
	initKeypressListener();
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

		$(document).unbind('keydown');
		$(document).unbind('keyup');

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
		gameCycle();
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
	$("#pauseButton").removeAttr("disabled");
	//$("#quitButton").removeAttr("disabled");

	$("#level2").attr("disabled", "disabled");
	$("#level1").attr("disabled", "disabled");
	gameOver = false;
	playing = false;
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
		toPlayUrl.push(zombies[i].audioUrl);
		console.log("Zombie[" + i + "] audio url: " + zombies[i].audioUrl);
		toPlayNames.push(zombies[i].name);
	}
	toPlayUrl.push(gameGuide.audioUrl);
	toPlayNames.push(gameGuide.name);
	var urlMap = [ toPlayNames, toPlayUrl ];
	audioManager.load(urlMap, startSounds);

	// draw map
	drawMiniMap();

	setTimeout(function() {
		bindKeys();
		startTime = new Date();
	}, lvl.startTimeDelay);
}

function startSounds() {
	console.log("Starting sounds");
  // start playing all sounds
  audioManager.play(gameGuide);
  for (var i = 0 ; i < NUMBER_OF_ZOMBIES ; i++) {
		  audioManager.play(zombies[i]);
	}

	// update all locations to default & add to the update array
	toUpdate = [];
	for (var i = 0 ; i < NUMBER_OF_ZOMBIES ; i++) {
		toUpdate.push(zombies[i]);
	}
	toUpdate.push(gameGuide);
	toUpdate.push(player);
	audioManager.updateAllPositions(toUpdate);

	// once all the sounds are loaded allow player to play
	playing = true;
}

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

function initKeypressListener(event) {
	$(document).keypress(function(event) {
		console.log(event.which);
		event.preventDefault();
		switch (event.which) {
			case 32:
				// Pause/Resume Game
				pauseGame();
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

