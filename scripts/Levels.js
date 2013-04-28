//////////////////////////////////////
//        Tutorial
//////////////////////////////////////
var Tutorial = {
	map: getBlankMap(),
	randomizeMap: function() {
		var map = this.map;
		map[15][15] = 4;
		map[14][15] = 4;
		map[15][14] = 4;
		map[14][14] = 4;
		map[14][13] = 4;
		map[15][13] = 4;
	},
	player: new Player(5.5, 5.5, (0 * Math.PI / 180)),
	NUMBER_OF_ZOMBIES: 0,
	gameGuide: new Guide(7.5,
											 5.5,
											 (-120 * Math.PI / 180)),
	tutorial1: {
	  name: "tutorial1",
	  url: 'http://cs.unc.edu/~stancill/comp585/tutorial1.ogg',
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
	tutorial2: {
	  name: "tutorial2",
	  url: 'http://cs.unc.edu/~stancill/comp585/tutorial2.ogg',
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
	tutorial3: {
	  name: "tutorial3",
	  url: 'http://cs.unc.edu/~stancill/comp585/tutorial3.ogg',
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
	tutorial4: {
	  name: "tutorial4",
	  url: 'http://cs.unc.edu/~stancill/comp585/tutorial4.ogg',
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
	epilog: {
	  name: "epilogLvl1",
	  url: 'http://cs.unc.edu/~stancill/comp585/followme.ogg',
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
	option: 5
}
Tutorial.prologUrls =	[ Tutorial.tutorial1.url,
											  Tutorial.tutorial2.url,
											  Tutorial.tutorial3.url,
											  Tutorial.tutorial4.url,
                        Tutorial.epilog.url ];
Tutorial.prologNames = [ Tutorial.tutorial1.name,
													Tutorial.tutorial2.name,
													Tutorial.tutorial3.name,
													Tutorial.tutorial4.name,
                          Tutorial.epilog.name ];
Tutorial.prolog = function( option, callback ) {
	RemoveAllListeners();
	switch (option) {
	  case 1:
	    // play the opening audio
	    console.log("tutorial level cycle 1");
	    Tutorial.tutorial1.move(gameGuide);
	    audioManager.updatePosition(Tutorial.tutorial1);
	    audioManager.play(Tutorial.tutorial1);
	    setTimeout(function() {
	        Tutorial.prolog(2, callback);
	      }, 35000);
	    break;
	  case 2:
	    // play the next sound
	    // enable left and right turns
	    console.log("tutorial level cycle 2");
	    Tutorial.tutorial2.move(gameGuide);
	    audioManager.updatePosition(Tutorial.tutorial2);
	    audioManager.play(Tutorial.tutorial2);

	    // move to player's right
	    setTimeout(function() {
	        gameGuide.x = 5.5;
	        gameGuide.y = 7.5;
	        Tutorial.tutorial2.move(gameGuide);
	        audioManager.updatePosition(Tutorial.tutorial2);
	        updateMiniMap();
	      }, 2000);

	    // move behind player
	    setTimeout(function() {
	        gameGuide.x = 3.5;
	        gameGuide.y = 5.5;
	        Tutorial.tutorial2.move(gameGuide);
	        audioManager.updatePosition(Tutorial.tutorial2);
	        updateMiniMap();
	      }, 5000);

	    // move to player's left
	    setTimeout(function() {
	        gameGuide.x = 5.5;
	        gameGuide.y = 3.5;
	        Tutorial.tutorial2.move(gameGuide);
	        audioManager.updatePosition(Tutorial.tutorial2);
	        updateMiniMap();
	      }, 7500);

	    // move in front of player
	    setTimeout(function() {
	        gameGuide.x = 7.5;
	        gameGuide.y = 5.5;
	        Tutorial.tutorial2.move(gameGuide);
	        audioManager.updatePosition(Tutorial.tutorial2);
	        updateMiniMap();
	      }, 10500);

	    setTimeout(function() {
	        Tutorial.prolog(3, callback);
	      }, 13000);
	    break;
	  case 3:
	    console.log("tutorial level cycle 3");
	    Tutorial.tutorial3.move(gameGuide);
	    audioManager.updatePosition(Tutorial.tutorial3);
	    audioManager.play(Tutorial.tutorial3);

	    setTimeout(function() {
	        Tutorial.prolog(4, callback);
	      }, 31000);
	    break;
	  case 4:
	    LevelKeypressListener();
	    gameGuide.x = 3.5;
	    gameGuide.y = 5.5;
	    globalGuide.overHere.move(gameGuide);
	    audioManager.updatePosition(globalGuide.overHere);
	    if (playProlog) {
		    if (player.rot == Math.PI) {
		      audioManager.stop(globalGuide.overHere);
		      Tutorial.prolog(5, callback);
		    } else {
		      audioManager.play(globalGuide.overHere);
		      setTimeout( function() { Tutorial.prolog(4, callback); } , 2500);
		    }
		  }
	    break;
	  case 5:
	    Tutorial.tutorial4.move(gameGuide);
	    audioManager.updatePosition(Tutorial.tutorial4);
	    audioManager.play(Tutorial.tutorial4);

	    // call the callback
	    setTimeout( function() {
	    	gameGuide.x = 15.5;
		    gameGuide.y = 15.5;
		    gameGuide.audioUrl = 'http://cs.unc.edu/~stancill/comp585/overhere.ogg';
	    	callback();
	    } , 10500);
	    break;
	}
};



//////////////////////////////////////
//        Level1
//////////////////////////////////////
var Level1 = {
	randomizeMap: function() {
		//do nothing
	},
	map: [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
	player: new Player(15.5, 2, (90 * Math.PI / 180)),
	NUMBER_OF_ZOMBIES: 0,
	gameGuide: new Guide(15.5,
											 2.5,
											 (-90 * Math.PI / 180),
											 'http://cs.unc.edu/~stancill/comp585/overhere.ogg'),
	option: 0,
	prolog1: {
	  name: "prolog1Lvl1",
	  url: "http://cs.unc.edu/~stancill/comp585/sounds/level1_prolog.ogg",
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
}
Level1.prologUrls =	[ Level1.prolog1.url ];
Level1.prologNames = [ Level1.prolog1.name ];
Level1.prolog = function( option, callback ) {
	var level = Level1;
	RemoveAllListeners();
	switch (option) {
	  case 0:
	    // play the opening audio
	    console.log("level1 cycle 1");
	    level.prolog1.move(gameGuide);
	    audioManager.updatePosition(level.prolog1);
	    audioManager.play(level.prolog1);
	    setTimeout(function() {
	        level.prolog(1, callback);
	      }, audioManager.sounds[level.prolog1.name].buffer.duration * 1000);
	    break;
	  case 1:
			LevelKeypressListener();
	    // call the callback
	    setTimeout( function() {
	    	callback();
	    } , 0);
	    break;
	}
};


//////////////////////////////////////
//        Level2
//////////////////////////////////////
var Level2 = {
	map: getBlankMap(),
	randomizeMap: function() {
		var map = this.map;
		map[1][1] = 2; // starting position for player
		var i = 1;
		var j = 1;
		var totalSpots = map.length + map[0].length - 4;

		while (i < map.length - 2 && j < map[0].length - 2) {
			var rand = Math.floor(Math.random() * totalSpots);
			// if rand is 1 increase i, if rand is 0 increase j
			i += rand < map.length - 2 ? 1 : 0;
			j += rand >= map.length - 2 ? 1 : 0;
			map[i][j] = 3;
			if (i+1 != map.length-1 && j+1 != map[0].length-1)
				map[i+1][j+1] = 3;
		}

		map[i][j] = 4;
		map[i + 1][j] = map[i + 1][j] == 1 ? map[i + 1][j] : 4;
		map[i - 1][j] = map[i - 1][j] == 1 ? map[i - 1][j] : 4;
		map[i][j + 1] = map[i][j + 1] == 1 ? map[i][j + 1] : 4;
		map[i][j - 1] = map[i][j - 1] == 1 ? map[i][j - 1] : 4;
	},
	player: new Player(1.5, 1.5, (0 * Math.PI / 180)),
	NUMBER_OF_ZOMBIES: 1,
	gameGuide: new Guide(2,
											 1.5,
											 (-120 * Math.PI / 180),
										   'http://cs.unc.edu/~stancill/comp585/overhere.ogg'),
	option: 0,
	prolog1: {
	  name: "prolog1Lvl2",
	  url: "http://cs.unc.edu/~stancill/comp585/sounds/level2_prolog.ogg",
	  x: 0,
	  y: 0,
	  panner: true,
	  move: function( guide ) {
	    this.x = guide.x;
	    this.y = guide.y;
	  }
	},
}
Level2.prologUrls =	[ Level2.prolog1.url ];
Level2.prologNames = [ Level2.prolog1.name ];
Level2.prolog = function( option, callback ) {
	var level = Level2;
	RemoveAllListeners();
	switch (option) {
	  case 0:
	    // play the opening audio
	    console.log("level2 cycle 1");
	    level.prolog1.move(gameGuide);
	    audioManager.updatePosition(level.prolog1);
	    audioManager.play(level.prolog1);
	    setTimeout(function() {
	        level.prolog(1, callback);
	      }, audioManager.sounds[level.prolog1.name].buffer.duration * 1000);
	    break;
	  case 1:
			LevelKeypressListener();
	    // call the callback
	    setTimeout( function() {
	    	callback();
	    } , 0);
	    break;
	}
};



function getBlankMap() {
	var map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	];
	return map;
}

// store an array of all levels
var levels = [ Tutorial, Level1, Level2 ];
