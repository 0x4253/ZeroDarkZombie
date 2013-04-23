var listener = {
  x: 0,
  y: 0,
  rot: 60,
  isListener: true  // Needed for a listener
};

var audioManager = new AudioManager(listener);

// Stuff like this would probably be stored for a specific level
var urls = [ 'http://www.cs.unc.edu/~stancill/comp585/Hay_steps_2.ogg',
'http://www.cs.unc.edu/~stancill/comp585/Concrete_Steps_2.ogg',
'http://upload.wikimedia.org/wikipedia/en/f/fc/Juan_Atkins_-_Techno_Music.ogg',
'http://cs.unc.edu/~stancill/comp585/gameover.ogg' ];
var names = [ "Hay", "Concrete", "Techno", "Dying" ];
var urlMap = [ names, urls ];

var soundObj1 = {
  name: names[2],
  loop: true,
  x: 10,
  y: 10,
  rot: 60
};

var soundObj2 = {
  name: names[0],
  loop: false,
  x: 10,
  y: 10,
  rot: 60
};

var soundObj3 = {
  name: names[1],
  loop: true,
  x: 10,
  y: 10,
  rot: 60
};

var soundObj4 = {
  name: names[3],
  loop: false,
  x: 10,
  y: 10,
  rot: 60
};

// Initialization method
function init() {
  audioManager.load( urlMap );
}

// Listener
function updateListenerPosition() {
  updatePosition( listener );
  audioManager.updatePosition( listener );
}

// Individual sounds
function play1() {
  audioManager.play( soundObj1 );
}
function stop1() {
  audioManager.stop( soundObj1 );
}
function pause1() {
  audioManager.pause( soundObj1 );
}
function resume1() {
  audioManager.resume( soundObj1 );
}
function updatePosition1() {
  updatePosition( soundObj1 );
  audioManager.updatePosition( soundObj1 );
}

function play2() {
  audioManager.play( soundObj2 );
}
function stop2() {
  audioManager.stop( soundObj2 );
}
function pause2() {
  audioManager.pause( soundObj2 );
}
function resume2() {
  audioManager.resume( soundObj2 );
}
function updatePosition2() {
  updatePosition( soundObj2 );
  audioManager.updatePosition( soundObj2 );
}

function play3() {
  audioManager.play( soundObj3 );
}
function stop3() {
  audioManager.stop( soundObj3 );
}
function pause3() {
  audioManager.pause( soundObj3 );
}
function resume3() {
  audioManager.resume( soundObj3 );
}
function updatePosition3() {
  updatePosition( soundObj3 );
  audioManager.updatePosition( soundObj3 );
}

function play4() {
  audioManager.play( soundObj4 );
}
function stop4() {
  audioManager.stop( soundObj4 );
}
function pause4() {
  audioManager.pause( soundObj4 );
}
function resume4() {
  audioManager.resume( soundObj4 );
}
function updatePosition4() {
  updatePosition( soundObj4 );
  audioManager.updatePosition( soundObj4 );
}

// Applies to all sounds
function pauseAllSounds() {
  audioManager.pauseEffects();
}
function resumeAllSounds() {
  audioManager.resumeEffects();
}
function deleteAllSounds() {
  audioManager.destroyAll();
}
function stopAllSounds() {
  audioManager.stopAll();
}
function updateAllPositions() {
  updatePosition( listener );
  updatePosition( soundObj1 );
  updatePosition( soundObj2 );
  updatePosition( soundObj3 );
  updatePosition( soundObj4 );
  var toUpdate = [soundObj1, soundObj2, soundObj3, soundObj4, listener];
  audioManager.updateAllPositions( toUpdate );
}
function masterGainChanged( e ) {
  audioManager.masterGainChanged( e );
}

// Helper
function updatePosition( soundObj ) {
  soundObj.x = Math.floor((Math.random()*10)+1);
  soundObj.y = Math.floor((Math.random()*10)+1);
  console.log("New position-> X: " + soundObj.x + ", Y: " + soundObj.y);
}