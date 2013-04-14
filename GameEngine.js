var startLevelNumber = 0;
var gameOver = false;
var playing = false;
var levelAlive;
var waitTime;
var distanceFromGuide;
var levelCompleted = 2;


function startGame() {
	setTimeout(function() {
		initGameEngine();
		GameEngineLoop();
	}, 100);
}

function initGameEngine() {
	initKeypressListener();
	levelAlive = false;

	if (typeof AudioContext == "function") {
		context = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		context = new webkitAudioContext();
	} else {
		alert('Web Audio API is not supported in this browser');
	}

	positionSample = new PositionSampleTest(context);
}

function GameEngineLoop() {
	if (levelAlive == false && startLevelNumber <= levelCompleted + 1) {
		switch (startLevelNumber) { 
			case 1:
				switchToLevel();
				initLevel(Level1);
				levelCycle(context);
				break;
			case 2:
				switchToLevel();
				initLevel(Level2);
				levelCycle(context);
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

function levelCycle(context) {
	if (playing) {
		gameCycle(context);
	}

	if (gameOver) {
		clearLevel();
	} else {
		setTimeout(function() {
			levelCycle(context);
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
}

function initLevel(lvl){
	lvl.randomizeMap();
	map = lvl.map;
	mapWidth = map[0].length;
	mapHeight = map.length;

	player.x = lvl.player.x;
	player.y = lvl.player.y;
	player.rot = lvl.player.rot;

	// reset active player attributes
	player.speed = 0;
	player.dir = 0;
	player.eaten = false;
	player.winner = false;

	NUMBER_OF_ZOMBIES = lvl.NUMBER_OF_ZOMBIES;

	gameGuide.x = lvl.gameGuide.x;
	gameGuide.y = lvl.gameGuide.y;
	gameGuide.rot = lvl.gameGuide.rot;

	drawMiniMap();

	guideAudio = lvl.guideAudio;
	zombieAudio = lvl.zombieAudio;

	setTimeout(function() {
		bindKeys();
		startTime = new Date();
	}, lvl.startTimeDelay);

	playing = true;
}

function pauseGame() {
	button = document.getElementById("pauseButton");
	if (levelAlive) {
		if (button.value == "Pause Game [space]") {
			button.value = "Resume Game [space]";
		} else {
			button.value = "Pause Game [space]";
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
}

