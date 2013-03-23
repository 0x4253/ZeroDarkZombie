//
// PositionSampleTest
//
function PositionSampleTest(context) {
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
}
PositionSampleTest.prototype.play = function () {
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
PositionSampleTest.prototype.stop = function () {
    this.source.noteOff(0);
    this.isPlaying = false;
};
PositionSampleTest.prototype.changePosition = function (position) {
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
PositionSampleTest.prototype.changeAngle = function (angle) {
    console.log(angle);
    this.panner.setOrientation(Math.cos(angle), -Math.sin(angle), 1);
};