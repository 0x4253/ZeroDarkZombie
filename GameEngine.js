var startLevelNumber = 0;
var gameOver = false;
var playing = false;
var loading = true;
var loadingSound = true;
var levelAlive;
var waitTime;
var distanceFromGuide;
var levelCompleted = 2;
var numLevels = 3; // one greater than actual num levels
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
	var img = document.getElementById("title");
	ctx.drawImage(img, 0, 0, miniMap.width, miniMap.height);
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
				initTutorial(Tutorial);
				// initLevel(Level1);
				levelCycle();
				break;
			case 2:
				switchToLevel();
				initLevel(Level2);
				levelCycle();
				break;
			case numLevels:
				document.location.reload();
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
		startLevelNumber += 1;

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
	if (loading) {
		document.getElementById("loading").style.display="block";
		if (loadingSound) {
			audioManager.loadAndPlay("Loading");
			loadingSound = false;
		}
	} else {
		document.getElementById("loading").style.display="none";
		loadingSound = true;
	}

	if (playing) {
		gameCycle();
	}

	if (gameOver) {
		audioManager.stopAll();
		gameGuide.play = false;
		endTime = new Date();
	  if (player.eaten) {
	    outputToScreen("You've been eaten! It took " +
	        millisecondsToStr( endTime - startTime ));
	    audioManager.loadAndPlay("Oh no!. . You've been eaten!. . It took " +
	        millisecondsToStr( endTime - startTime ));
	  }
	  else if (player.winner) {
	  	endTime = new Date();
	  	outputToScreen("YOU WON! It took " +
	        millisecondsToStr( endTime - startTime ));
	    audioManager.loadAndPlay("Yay!. . You won!. .  It took " +
	        millisecondsToStr( endTime - startTime ));
	  }
		setTimeout(function() {
			clearLevel();
		}, 5000);
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

function initTutorial(tutorial) {
	// initialize map
	tutorial.randomizeMap();
	map = tutorial.map;
	mapWidth = map[0].length;
	mapHeight = map.length;

	// initialize player/guide/zombie(s)
	player = tutorial.player;
	NUMBER_OF_ZOMBIES = tutorial.NUMBER_OF_ZOMBIES;
	gameGuide = tutorial.gameGuide;

	// initialize sounds for AudioManager
	audioManager.masterGainChanged( 1 );

	toPlayUrl.push(tutorial1.url);
	toPlayNames.push(tutorial1.name);

	toPlayUrl.push(tutorial2.url);
	toPlayNames.push(tutorial2.name);

	toPlayUrl.push(tutorial3.url);
	toPlayNames.push(tutorial3.name);

	toPlayUrl.push(tutorial4.url);
	toPlayNames.push(tutorial4.name);

	toPlayUrl.push(overHere.url);
	toPlayNames.push(overHere.name);

	var urlMap = [ toPlayNames, toPlayUrl ];
	audioManager.load(urlMap, tutorialStart);

	// draw map
	drawMiniMap();

	setTimeout(function() {
		LevelKeypressListener();
		startTime = new Date();
	}, tutorial.startTimeDelay);
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
  if (NUMBER_OF_ZOMBIES > 0) {
		toPlayUrl.push(zombie.audioUrl);
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

function tutorialStart() {
	toUpdate.push(gameGuide);
	// toUpdate.push(tutorial1);
	// toUpdate.push(tutorial2);
	// toUpdate.push(tutorial3);
	// toUpdate.push(tutorial4);
  toUpdate.push(player);
  audioManager.updateAllPositions(toUpdate);
  tutorialLevelCycle(1, clearLevel);
  loading = false;
  playing = true;
}

function startSounds() {
	console.log("Starting sounds");
  // start playing all sounds
  if (gameGuide.audioUrl != "") {
  	// audioManager.play(gameGuide);
  	console.log("Start gameGuide sound");
  	gameGuide.play = true;
  	gameGuide.start( gameGuide );
  }
  if (NUMBER_OF_ZOMBIES > 0)
		audioManager.play(zombie);

	// update all locations to default & add to the update array
	toUpdate = [];
	if (NUMBER_OF_ZOMBIES > 0)
  	toUpdate.push(zombie);
	toUpdate.push(gameGuide);
	toUpdate.push(player);
	audioManager.updateAllPositions(toUpdate);

	// once all the sounds are loaded allow player to play
	loading = false;
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
	audioManager.stopAll();
	loading = true;
}

