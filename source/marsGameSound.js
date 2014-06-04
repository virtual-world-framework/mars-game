var self;

this.initialize = function() {
    self = this;

    var soundDefinition = { soundName: "laser", soundURL: "assets/sounds/laser.wav" }
    var playMe = function() {
        self.playSound("laser");
    }
    this.loadSound(soundDefinition, playMe);
}

//@ sourceURL=source/marsGameSound.js
