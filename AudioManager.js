//
// AudioManager
//
// takes an initializer object that has at least the following attributes:
// - 'x' -> X coordinate
// - 'y' -> Y coordinate
// - 'rot' -> the object's rotational value
//
// this initial object will set up the listener's position
function AudioManager( initialOptions ) {
  // setup the audio context
  if ( typeof AudioContext == "function" ) {
    this.audioContext = new AudioContext();
  } else if ( typeof webkitAudioContext == "function" ) {
    this.audioContext = new webkitAudioContext();
  } else {
    alert( 'Web Audio API is not supported in this browser' );
  }
  // map for loaded sounds
  this.sounds = {};
  // panner properties
  this.coneOuterGain = 0.0005;
  this.coneOuterAngle = 120;
  this.coneInnerAngle = 60;
  // setup listener's positional information
  if (typeof initialOptions != 'undefined') {
    var x = initialOptions.x;
    var y = initialOptions.y;
    var rot = initialOptions.rot;
  }
  var initialX = x || 1;
  var initialY = y || 1;
  var initialRot = rot || 0;
  this.audioContext.listener.setPosition( initialX, initialY, 0 );
  this.audioContext.listener.setOrientation( Math.cos( initialRot ),
    Math.sin( initialRot ), -1, 0,0,-1 );
  // create our permanent nodes
  this.nodes = {
    destination: this.audioContext.destination,
    masterGain: this.audioContext.createGainNode(),
    coreEffectsGain: this.audioContext.createGainNode(),
    effectsGain: this.audioContext.createGainNode()
  };
  // and setup the graph
  this.nodes.masterGain.connect( this.nodes.destination );
  this.nodes.coreEffectsGain.connect( this.nodes.masterGain );
  this.nodes.effectsGain.connect( this.nodes.coreEffectsGain );
}


// Changes the master gain value
AudioManager.prototype.masterGainChanged = function ( e ) {
    var value = parseFloat( e );
    this.nodes.masterGain.gain.value = value;
};


// Destroys all the sound objects that have been loaded
AudioManager.prototype.destroyAll = function() {
  for ( var name in this.sounds ) {
    var sound = this.sounds[ name ];
    if ( typeof sound != 'undefined' && sound.source != null ) {
      sound.source.loop = false;
      sound.source.noteOff( 0 );
      sound.source.disconnect();
      delete sound.source;
      delete this.sounds[ name ];
      delete sound;
    }
  }
}


// Stops all the sound objects that have been loaded
AudioManager.prototype.stopAll = function() {
  for ( var name in this.sounds ) {
    var sound = this.sounds[ name ];
    if ( typeof sound != 'undefined' && sound.source != null ) {
      sound.source.loop = false;
      sound.source.noteOff( 0 );
      sound.source.disconnect();
      delete sound.source;
      delete sound;
    }
  }
}


// Stops the specified sound object. The sound object must have at least an
// attribute of:
// - 'name' -> name of the object (e.g. "player", "zombie")
AudioManager.prototype.stop = function( soundObj ) {
  if ( typeof soundObj.name == 'undefined' ) {
    alert( "Sound object in method 'stop' must" +
     " have an attribute: 'name' defined." );
    return;
  }
  var sound = this.sounds[ soundObj.name ];
  if ( typeof sound != 'undefined' && sound.source != null ) {
    sound.source.loop = false;
    sound.source.noteOff( 0 );
    sound.source.disconnect();
    delete sound.source;
    delete sound;
  }
}


// takes an object that has the following attributes:
// - 'name' -> name of the object (e.g. "player", "zombie")
// - 'x' -> X coordinate
// - 'y' -> Y coordinate
// - 'rot' -> the object's rotational value
// - 'isListener' -> boolean to determine is this object is the listener
AudioManager.prototype.updatePosition = function( options ) {
  if ( options.isListener ) {
    this.audioContext.listener.setPosition( options.x, options.y, 0 );
    this.audioContext.listener.setOrientation( Math.cos( options.rot ),
      Math.sin( options.rot ), -1, 0,0,-1 );
  } else {
    var sound = this.sounds[ options.name ];
    if ( typeof sound != 'undefined' && sound.panner != null ) {
      sound.x = options.x;
      sound.y = options.y;
      sound.rot = options.rot;
      sound.panner.setPosition( sound.x, sound.y, 0);
      sound.panner.setOrientation( Math.cos( sound.rot ),
          Math.sin( sound.rot ), 0) ;
    }
  }
}

// takes an array of objects, each with the following attributes:
// - 'name' -> name of the object (e.g. "player", "zombie")
// - 'x' -> X coordinate
// - 'y' -> Y coordinate
// - 'rot' -> the object's rotational value
// - 'isListener' -> boolean to determine is this object is the listener
AudioManager.prototype.updateAllPositions = function( options ) {
  for (var i = 0; i < options.length; i++) {
    if ( options[i].isListener ) {
      this.audioContext.listener.setPosition( options[i].x, options[i].y, 0 );
      this.audioContext.listener.setOrientation( Math.cos( options[i].rot ),
        Math.sin( options[i].rot ), -1, 0,0,-1 );
      // console.log("Updated listener coord - x: " + options[i].x +
      //              ", y: " + options[i].y +
      //              " & rot: " + options[i].rot);
    } else {
      var sound = this.sounds[ options[i].name ];
      if ( typeof sound != 'undefined' && sound.panner != null ) {
        sound.x = options[i].x;
        sound.y = options[i].y;
        sound.rot = options[i].rot;
        sound.panner.setPosition( sound.x, sound.y, 0);
        sound.panner.setOrientation( Math.cos( sound.rot ),
            Math.sin( sound.rot ), 0) ;
        // console.log("Updated " + options[i].name + " coord - x: " + options[i].x +
        //             ", y: " + options[i].y +
        //             " & rot: " + options[i].rot);
      }
    }
  };
}

// takes an object that has the following attributes:
// - 'name'
// - 'x' & 'y' coordinates
// - 'rot' or a rotation value
AudioManager.prototype.play = function( options ) {
  if ( typeof options.name == 'undefined' ) {
    alert( "Object in method 'play' must" +
     " have an attribute: 'name' defined." );
    return;
  }
  var now = Date.now(),
    // pull from a map of loaded audio buffers
    sound = this.sounds[ options.name ],
    channel,
    source,
    resumeSource,
    panner,
    resumePanner;
  if ( typeof sound == 'undefined' || sound == null ) {
    alert( "Specified sound was either undefined or null." );
    return;
  }
  // discard old nodes that have passed their buffer duration
  if ( sound.source ) {
    var source = sound.source;
    if ( !options.loop ) {
      if ( now - source.noteOnAt > sound.buffer.duration * 1000 ) {
        // discard the previous source node
        source.noteOff( 0 );
        source.disconnect();
      } else if ( typeof options.pausedAt == 'undefined' ) {
        return;
      }
    } else if ( options.loop ) {
      if ( typeof options.pausedAt == 'undefined' )
        return;
      // discard the previous source node
      source.noteOff( 0 );
      source.disconnect();
    } else {
      // needed to prevent multiple instances of a sound being played if played
      // repeatively
      return;
    }
  }
  // which channel to connect this node to
  channel = this.nodes.effectsGain;

  // decide to make it a panner node or not
  if ( typeof options.panner != 'undefined' && options.panner ) {
    // create panner node for this sound, but treat it special if it's a zombie
    panner = this.audioContext.createPanner();
    panner.coneOuterGain = (options.isZombie ? options.coneOuterGain : this.coneOuterGain);
    panner.coneOuterAngle = (options.isZombie ? options.coneOuterAngle : this.coneOuterAngle);
    panner.coneInnerAngle = (options.isZombie ? options.coneInnerAngle : this.coneInnerAngle);
    if (options.isZombie)
      panner.rolloffFactor = options.rolloffFactor;
    panner.connect( channel );
  }
  // create a basic buffer source for this node
  source = this.audioContext.createBufferSource();
  // assign sound it's positional information
  if ( typeof options.panner != 'undefined' && options.panner ) {
    sound.x = options.x;
    sound.y = options.y;
    sound.rot = options.rot;
    panner.setPosition( sound.x, sound.y, 0 );
    panner.setOrientation( Math.cos( sound.rot ), Math.sin( sound.rot ), 0 );
  }
  // finish assigning sound & source their playback information
  source.noteOnAt = now;
  sound.source = source;
  sound.panner = panner;
  sound.loop = options.loop || false;
  source.buffer = sound.buffer;
  sound.length = sound.buffer.duration;
  if ( typeof options.panner != 'undefined' && options.panner ) {
    source.connect( panner );
  } else {
    source.connect( channel );
  }
  source.loop = sound.loop;
  // resume if we were paused, using 'options.pausedAt' here instead of
  // 'sound.pausedAt' to prevent playing a new sound with the same
  // name from a old sound's paused location
  if ( options.pausedAt ) {
    source.start(
      0,
      sound.pausedAt,
      sound.buffer.duration - ( sound.pausedAt / 1000 )
    );
    source.noteOnAt = now - sound.pausedAt;
    // reset the loop params correctly
    if ( sound.loop ) {
      source.loopStart = 0;
      source.loopEnd = sound.length;
    }
  } else {
    // start play immediately
    source.noteOn( 0 );
    console.log("Playing: " + options.name + ", coord - x: " + options.x + ", y: " + options.y);
  }
}


// Pauses all sounds connected to the effectsGain node
AudioManager.prototype.pauseEffects = function() {
  this.nodes.effectsGain.disconnect();
  var now = Date.now();
  for ( var name in this.sounds ) {
    var sound = this.sounds[ name ];
    if ( typeof sound != 'undefined' && sound.source != null ) {
      if ( !sound.source.loop
        && now - sound.source.noteOnAt < sound.buffer.duration * 1000 ) {
        sound.pausedAt = now - sound.source.noteOnAt;
        sound.source.noteOff( 0 );
      }
      // calculate special pause time for looping sounds
      if ( sound.loop ) {
        sound.pausedAt = ( now - sound.source.noteOnAt ) %
         ( sound.buffer.duration * 1000 );
        sound.source.stop( 0 );
      }
    }
  }
}


// Pauses the specified sound object. The sound object must have at least an
// attribute of:
// - 'name' -> name of the object (e.g. "player", "zombie")
AudioManager.prototype.pause = function( soundObj ) {
  if ( typeof soundObj.name == 'undefined' ) {
    alert( "Sound object in method 'pause' must" +
     " have an attribute: 'name' defined." );
    return;
  }
  var now = Date.now();
  var sound = this.sounds[ soundObj.name ];
  if ( typeof sound != 'undefined' && sound.source != null ) {
    if ( !sound.source.loop
      && now - sound.source.noteOnAt < sound.buffer.duration * 1000 ) {
      sound.pausedAt = now - sound.source.noteOnAt;
      sound.source.noteOff( 0 );
    }
    // calculate special pause time for looping sounds
    if ( sound.loop ) {
      sound.pausedAt = ( now - sound.source.noteOnAt ) %
       ( sound.buffer.duration * 1000 );
      sound.source.stop( 0 );
    }
  }
}


// Resumes all sounds connected to the effectsGain node
AudioManager.prototype.resumeEffects = function() {
  this.nodes.effectsGain.connect( this.nodes.coreEffectsGain );
  var now = Date.now();
  for ( var name in this.sounds ) {
    var sound = this.sounds[ name ];
    if ( sound.pausedAt ) {
      this.play( sound );
      delete sound.pausedAt;
    }
  }
};


// Resumes the specified sound object. The sound object must have at least an
// attribute of:
// - 'name' -> name of the object (e.g. "player", "zombie")
AudioManager.prototype.resume = function( soundObj ) {
  if ( typeof soundObj.name == 'undefined' ) {
    alert( "Sound object in method 'resume' must" +
     " have an attribute: 'name' defined." );
    return;
  }
  var now = Date.now();
  var sound = this.sounds[ soundObj.name ];
  if ( typeof sound != 'undefined' && sound.pausedAt ) {
    this.play( sound );
    delete sound.pausedAt;
  }
};


// Accepts a multi-dimensional array (urlMap) that holds two arrays
// The first array is the name of the objects
// The second array is their corresponding url links
AudioManager.prototype.load = function( urlMap, callback) {
  var urlList = [];
  for (var i = 0; i < urlMap[0].length; i++) {
    urlList.push(urlMap[1][i]); // access the url list
  };
  // grab an instance of this.sounds map
  var sounds = this.sounds;
  // load each url
  bufferLoader = new BufferLoader(this.audioContext, urlList,
     function (buffers) {
        for (var i = 0; i < buffers.length; i++) {
          var sound = {
            name: urlMap[0][i], // assign this sound a name
            buffer: buffers[i], // assign this sound it's sound buffer
            source: null
            };
          sounds[ sound.name ] = sound;
          console.log("Loaded sound: " + sound.name);
        };
        if ( typeof( callback ) === 'function' )
          callback();
      });
  bufferLoader.load();
}


//
// BufferLoader
//
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function (url, index) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function () {
        loader.context.decodeAudioData(request.response, function (buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
        }, function (error) {
            console.error('decodeAudioData error', error);
        });
    };
    request.onerror = function () {
        alert('BufferLoader: XHR error');
    };
    request.send();
};
BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
};