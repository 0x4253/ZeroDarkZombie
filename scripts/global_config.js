// basic global entities
var audioManager = new AudioManager();

// variable that stores references to all global menu sound objects
var globalMenu = {
  menuBgNoise: {
    url: 'http://cs.unc.edu/~stancill/comp585/Drone_Dark_1.ogg',
    name: "menuBgNoise",
    loop: true
  },
  loading: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/loading.ogg',
    name: "loading"
  },
  menu_intro: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/menu_intro.ogg',
    name: "menu_intro"
  },
  menu_intro: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/menu_intro.ogg',
    name: "menu_intro"
  },
  startgame: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/startgame.ogg',
    name: "startgame"
  },
  selectlevel: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/selectlevel.ogg',
    name: "selectlevel"
  },
  survival_mode: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/survivalmode.ogg',
    name: "survival_mode"
  },
  mainmenu: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/mainmenu.ogg',
    name: "mainmenu"
  },
  tutorial: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/tutorial.ogg',
    name: "tutorial"
  },
  level1: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/level1.ogg',
    name: "level1"
  },
  level2: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/level2.ogg',
    name: "level2"
  },
  level3: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/level3.ogg',
    name: "level3"
  },
  level4: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/level4.ogg',
    name: "level4"
  }
}

// sound objects specific to the guide
var globalGuide = {
  overHere: {
    name: "overHere",
    url: 'http://cs.unc.edu/~stancill/comp585/overhere.ogg',
    x: 0,
    y: 0,
    panner: true,
    move: function( guide ) {
      this.x = guide.x;
      this.y = guide.y;
    }
  },
  followMe: {
    name: "followMe",
    url: 'http://cs.unc.edu/~stancill/comp585/followme.ogg',
    x: 0,
    y: 0,
    panner: true,
    move: function( guide ) {
      this.x = guide.x;
      this.y = guide.y;
    }
  }
}

var globalGuideLevel3 = {
  patch: {
    name: "patch",
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/level3_patch.ogg',
    x: 0,
    y: 0,
    panner: true,
    move: function( guide ) {
      this.x = guide.x;
      this.y = guide.y;
    }
  }
}

// create soundObjs that are always used
var globalLevel = {
  soundObjHay: {
    name: "hay",
    url: 'http://www.cs.unc.edu/~stancill/comp585/Hay_steps_2.ogg',
    background: true
  },
  soundObjConcrete: {
    name: "concrete",
    url: 'http://www.cs.unc.edu/~stancill/comp585/Concrete_Steps_2.ogg',
    background: true
  },
  soundObjMud: {
    name: "mud",
    url: 'http://www.cs.unc.edu/~stancill/comp585/sounds/mudstep.ogg',
    background: true
  },
  soundObjWallBump: {
    name: "wallBump",
    url: 'http://cs.unc.edu/~stancill/comp585/bump.mp3',
    background: true
  },
  soundObjWin: {
    name: "win",
    url: 'http://cs.unc.edu/~stancill/comp585/tada.wav',
    background: true
  },
  soundObjLose: {
    name: "lose",
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/gameover.ogg',
    background: true
  },
  soundObjWoosh: {
    name: "woosh",
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/woosh.ogg',
    background: true
  },
  soundObjZombieHit: {
    name: "zombiehit",
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/zombiehit.ogg',
    background: true
  },
  soundObjZombieDeath: {
    name: "zombiedeath",
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/zombiedeath.ogg',
    background: true
  }
}