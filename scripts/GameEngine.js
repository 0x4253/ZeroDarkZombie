////////////////////////////////////////////////////////
// 					variables used
////////////////////////////////////////////////////////
var gameAlive = false;
var startLevelNumber = 0;
var levelAlive = false;
var playProlog = false;
var gameOver = false;
var playing = false;
var startTime, endTime; // variables to keep time
var map = getBlankMap();;

////////////////////////////////////////////////////////
// 					functions used
////////////////////////////////////////////////////////
function startGame() {
	setTimeout( function() {
		// bind keys for menu
		MenuKeypressListener();

		// render menu visuals
		drawMenu();
		drawSkull();
		setTimeout( function() { drawText() }, 500);

		// load and play menu sounds
		var menuToPlayURLs = [ globalMenu.menuStartSound.url,
													 globalMenu.menuBgNoise.url,
													 globalMenu.loading.url ];
		var menuToPlayNames = [ globalMenu.menuStartSound.name,
														globalMenu.menuBgNoise.name,
														globalMenu.loading.name ];
		var menuUrlMap = [ menuToPlayNames, menuToPlayURLs ];
		audioManager.load( menuUrlMap, function() {
			audioManager.play(globalMenu.menuBgNoise);
			setTimeout( function() { startMenuSound(); }, 3000 );
		});
	}, 100);
}

function startMenuSound() {
	if ( !levelAlive ) {
		audioManager.play( globalMenu.menuStartSound );
		setTimeout( function() { startMenuSound(); }, 20000 );
	}
}

function startLevel( num ) {
	startLevelNumber = num;

	// load loading sound as it gets destroyed in clearMap()
	var menuToPlayURLs = [ globalMenu.loading.url ];
	var menuToPlayNames = [ globalMenu.loading.name ];
	var menuUrlMap = [ menuToPlayNames, menuToPlayURLs ];
	audioManager.load( menuUrlMap, function() {
		setTimeout( function() {
			gameAlive = true;
			clearMap();
			levelAlive = false;
	  	GameEngineLoop();
		} , 300);
	});
}

function GameEngineLoop() {
	// only change level if levelAlive is false
	if ( levelAlive == false ) {
		// load next level
		if ( startLevelNumber >= levels.length ) {
			// reload to main menu
			document.location.reload();
		} else {
			loadLevel( startLevelNumber );
			levelAlive = true;
		}
	}

	// only if the game is alive
	// keep looping
	if ( gameAlive ) {
		setTimeout( function() {
			GameEngineLoop();
		}, 100);
	}
}

function loadLevel( lvlNum ) {
	clearMap();
	console.log("Loading level num: " + lvlNum);
	console.log("Level: " + levels);
	initLevel( levels[ lvlNum ] );
}

function update(totalTime) {
  $.create("http://followmyvoice.herokuapp.com/leaderboards/", {
    leaderboard: {
      name: "tester",
      time: totalTime
      }
    }, function(response) {
      console.log(response);
    }
  );
}

function levelCycle() {
	if ( gameOver ) {
		// playing = false;
		audioManager.stopAll();
		gameGuide.play = false;
		endTime = new Date();
		totalTime = endTime - startTime;

	  if ( player.eaten ) {
	  	loseSound();
	  } else if ( player.winner ) {
	  	update( totalTime );
      audioManager.backgroundGainChanged( 1 ); // set background gain level
      audioManager.play( levels[ startLevelNumber ].epilog );
      audioManager.backgroundGainChanged( 0.3 ); // set background gain level
      setTimeout( function() {
        newLevel();
      }, audioManager.sounds[ levels[ startLevelNumber ].epilog.name ].buffer.duration * 1000 );
	  }
	} else {
		gameCycle();
		setTimeout(function() { levelCycle(); }, 100);
	}
}

function newLevel() {
  startLevelNumber++;
  levelAlive = false;
  gameOver = false;
}

function initLevel( lvl ) {
	// initialize map
	lvl.randomizeMap();
	map = lvl.map;
	mapWidth = map[0].length;
	mapHeight = map.length;

	// initialize player/guide/zombie(s)
	// for the level engine
	player = lvl.player;
	gameGuide = lvl.gameGuide;
	NUMBER_OF_ZOMBIES = lvl.NUMBER_OF_ZOMBIES;

	// load global guide sounds
	for ( var soundObjKey in globalGuide ) {
		toPlayUrl.push( globalGuide[ soundObjKey ].url );
		toPlayNames.push( globalGuide[ soundObjKey ].name );
	}

	// load global level sounds
	for ( var soundObjKey in globalLevel ) {
		toPlayUrl.push( globalLevel[ soundObjKey ].url );
		toPlayNames.push( globalLevel[ soundObjKey ].name );
	}

	// load level's prolog sound(s)
	for (var i = 0; i < lvl.prologUrls.length; i++) {
		toPlayUrl.push( lvl.prologUrls[ i ] );
		toPlayNames.push( lvl.prologNames[ i ] );
	};

	// load zombie sounds
  if (NUMBER_OF_ZOMBIES > 0) {
		toPlayUrl.push( zombie.audioUrl );
		toPlayNames.push( zombie.name );
	}

	// tell audioManager to load sounds
	// after loading all sounds it will perform
	// the level's prolog
	var urlMap = [ toPlayNames, toPlayUrl ];
	audioManager.masterGainChanged( 1 ); // set master gain level
	audioManager.backgroundGainChanged( 0.3 ); // set background gain level
	setTimeout( function() {
		audioManager.load( urlMap, function () { startProlog( lvl ) } );
	}, 2000);

	// start the loading gif and sound
	document.getElementById("loading").style.display="block";
	audioManager.play( globalMenu.loading );
}

function startProlog( lvl ) {
	// stop the loading gif
	document.getElementById("loading").style.display="none";

	// update the guides position and all of
	// the guide's global sounds
	toUpdate.push(gameGuide);
	for ( var soundObjKey in globalGuide ) {
		toUpdate.push(globalGuide[ soundObjKey ]);
	}

	// update the player's position
  toUpdate.push(player);
  audioManager.updateAllPositions(toUpdate);

	// draw map
	drawMiniMap();

  // start level engine's gameCycle()
  // and play prolog
  playProlog = true;
  PrologPlay();
	LevelKeypressListener(); // rebind keys to level inputs
	lvl.prolog( lvl.option, playLevel );
}

// allows prolog to have the gameCycle() running
function PrologPlay() {
	if ( playProlog ) {
		gameCycle();
		setTimeout( function() { PrologPlay(); }, 100 );
	}
}

// start the level officially
function playLevel() {
	// stop the gameCycle() for the prolog
	playProlog = false;

 	// start playing all sounds
	console.log("Starting sounds");
	console.log("Start gameGuide sound");
	gameGuide.play = true;
	gameGuide.start( gameGuide );

  if (NUMBER_OF_ZOMBIES > 0)
		audioManager.play(zombie);

	// add zombie to the update array
	if (NUMBER_OF_ZOMBIES > 0)
  	toUpdate.push(zombie);
	audioManager.updateAllPositions(toUpdate);

	// once all the sounds are loaded allow player to play
	startTime = new Date();
	LevelKeypressListener();
	levelCycle();
}

function clearMap() {
	// clear the canvas
	var mm = $('#minimap')[0];
	mm.width = mm.width;
	var mmo = $('#minimapobjects')[0];
	mmo.width = mmo.width;
	var lm = $('#levelmap')[0];
	lm.width = lm.width;

	// stop all sounds
	audioManager.destroyAll();
}

function togglePause() {
  if ( playing == true ){
    playing = false;
    audioManager.pauseEffects();
  } else {
    audioManager.resumeEffects();
    playing = true;
  }
}

function drawMenu(){
	var miniMap = $("#minimap")[0]; // the actual map
	var ctx = miniMap.getContext("2d");
	ctx.fillStyle = "rgb(50, 150, 50)";
	ctx.fillRect(0,0,miniMap.width,miniMap.height);
	var img = document.getElementById("bg");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var img = document.getElementById("bg_title");
	ctx.drawImage(img, 0, 100, img.width, img.height);
}

function drawSkull(){
	var miniMap = $("#minimap")[0]; // the actual map
	var ctx = miniMap.getContext("2d");
	ctx.globalAlpha = 0.1; //sets opacity. 0 = transparent
	var img = document.getElementById("bg_skull");
	ctx.drawImage(img, -30, 300, img.width, img.height);
}

function drawText(){
	var miniMap = $("#minimap")[0]; // the actual map
	var ctx = miniMap.getContext("2d");
	ctx.globalAlpha = 1; //sets opacity. 0 = transparent
	var img = document.getElementById("bg_start");
	ctx.drawImage(img, -5, 170, img.width, img.height);
}

function curtainMode () {
      curtain = document.getElementById("curtain");
      if (curtain.value == "Curtain Mode: On"){
        curtain.value = "Curtain Mode: Off";
        document.getElementById("minimap").style.display="block";
        document.getElementById("levelmap").style.display="block";
        document.getElementById("minimapobjects").style.display="block";
      }
      else {
        curtain.value = "Curtain Mode: On";
        document.getElementById("minimap").style.display="none";
        document.getElementById("levelmap").style.display="none";
        document.getElementById("minimapobjects").style.display="none";
      }
    }
