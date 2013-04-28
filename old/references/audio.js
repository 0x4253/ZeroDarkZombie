var context;
var bufferLoader;

//
// Field
//
function Field(canvas) {
    this.ANGLE_STEP = 0.2;
    this.canvas = canvas;
    this.isMouseInside = false;
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    this.angle = 0;
    this.point = null;
    var obj = this;
    canvas.addEventListener('mouseover', function () {
        obj.handleMouseOver.apply(obj, arguments);
    });
    canvas.addEventListener('mouseout', function () {
        obj.handleMouseOut.apply(obj, arguments);
    });
    canvas.addEventListener('mousemove', function () {
        obj.handleMouseMove.apply(obj, arguments);
    });
    canvas.addEventListener('mousewheel', function () {
        obj.handleMouseWheel.apply(obj, arguments);
    });
    canvas.addEventListener('keydown', function () {
        obj.handleKeyDown.apply(obj, arguments);
    });
    this.manIcon = new Image();
    this.manIcon.src = 'http://www.html5rocks.com/en/tutorials/webaudio/games/res/man.svg';
    this.speakerIcon = new Image();
    this.speakerIcon.src = 'http://www.html5rocks.com/en/tutorials/webaudio/games/res/speaker.svg';
    var ctx = this;
    this.manIcon.onload = function () {
        ctx.render();
    };
}
Field.prototype.render = function () {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.manIcon, this.center.x - this.manIcon.width / 2, this.center.y - this.manIcon.height / 2);
    ctx.fill();
    if (this.point) {
        ctx.save();
        ctx.translate(this.point.x, this.point.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.speakerIcon.width / 2, -this.speakerIcon.height / 2);
        ctx.drawImage(this.speakerIcon, 0, 0);
        ctx.restore();
    }
    ctx.fill();
};
Field.prototype.handleMouseOver = function (e) {
    this.isMouseInside = true;
};
Field.prototype.handleMouseOut = function (e) {
    this.isMouseInside = false;
    if (this.callback) {
        this.callback(null);
    }
    this.point = null;
    this.render();
};
Field.prototype.handleMouseMove = function (e) {
    if (this.isMouseInside) {
        this.point = {
            x: e.offsetX,
            y: e.offsetY
        };
        this.render();
        if (this.callback) {
            this.callback({
                x: this.point.x - this.center.x,
                y: this.point.y - this.center.y
            });
        }
    }
};
Field.prototype.handleKeyDown = function (e) {
    if (e.keyCode == 37) {
        this.changeAngleHelper(-this.ANGLE_STEP);
    } else if (e.keyCode == 39) {
        this.changeAngleHelper(this.ANGLE_STEP);
    }
};
Field.prototype.handleMouseWheel = function (e) {
    e.preventDefault();
    this.changeAngleHelper(e.wheelDelta / 500);
};
Field.prototype.changeAngleHelper = function (delta) {
    this.angle += delta;
    if (this.angleCallback) {
        this.angleCallback(this.angle);
    }
    this.render();
};
Field.prototype.registerPointChanged = function (callback) {
    this.callback = callback;
};
Field.prototype.registerAngleChanged = function (callback) {
    this.angleCallback = callback;
};


//
// PositionSample
//
function PositionSample(context) {
    var urls = ['http://upload.wikimedia.org/wikipedia/en/f/fc/Juan_Atkins_-_Techno_Music.ogg'];
    var sample = this;
    this.isPlaying = false;
    var loader = new BufferLoader(context, urls, function (buffers) {
        sample.buffer = buffers[0];
    });
    loader.load();
    var canvas = document.getElementById('minimapobjects');
    this.size = {
        width: canvas.width,
        height: canvas.height
    };
    field = new Field(canvas);
    field.registerPointChanged(function () {
        sample.changePosition.apply(sample, arguments);
    });
    field.registerAngleChanged(function () {
        sample.changeAngle.apply(sample, arguments);
    });
}
PositionSample.prototype.play = function () {
    var source = context.createBufferSource();
    source.buffer = this.buffer;
    source.loop = true;
    var panner = context.createPanner();
    panner.coneOuterGain = 0.1;
    panner.coneOuterAngle = 180;
    panner.coneInnerAngle = 0;
    panner.connect(context.destination);
    source.connect(panner);
    source.noteOn(0);
    context.listener.setPosition(0, 0, 0);
    this.source = source;
    this.panner = panner;
    this.isPlaying = true;
};
PositionSample.prototype.stop = function () {
    this.source.noteOff(0);
    this.isPlaying = false;
};
PositionSample.prototype.changePosition = function (position) {
    if (position) {
        if (!this.isPlaying) {
            this.play();
        }
        var mul = 2;
        var x = position.x / this.size.width;
        var y = -position.y / this.size.height;
        this.panner.setPosition(x * mul, y * mul, -0.5);
    } else {
        this.stop();
    }
};
PositionSample.prototype.changeAngle = function (angle) {
    console.log(angle);
    this.panner.setOrientation(Math.cos(angle), -Math.sin(angle), 1);
};


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