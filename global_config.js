// basic global entities
var audioManager = new AudioManager();

// variable that stores references to all global menu sound objects
var globalMenu = {
  menuStartSound: {
    url: 'http://www.cs.unc.edu/~stancill/comp585/Blaine_intro.ogg',
    name: "menuStartSound"
  },
  menuBgNoise: {
    url: 'http://cs.unc.edu/~stancill/comp585/Drone_Dark_1.ogg',
    name: "menuBgNoise",
    loop: true
  },
  loading: {
    url: 'http://cs.unc.edu/~stancill/comp585/sounds/loading.ogg',
    name: "loading"
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
    url: 'http://cs.unc.edu/~stancill/comp585/gameover.ogg',
    background: true
  }
}