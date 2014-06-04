this.initialize = function() {
    var soundDefinition = { soundName: "laser", soundURL: "assets/sounds/laser.wav" }
    var playMe = function() {
        PlaySound("laser");
    }
    loadSound(soundDefinition, playMe);
}