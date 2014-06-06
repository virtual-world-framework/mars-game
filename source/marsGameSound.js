<<<<<<< HEAD
this.initialize = function() {
    var soundDefinition = { soundName: "laser", soundURL: "assets/sounds/laser.wav" }
    var playMe = function() {
        PlaySound("laser");
    }
    loadSound(soundDefinition, playMe);
}
=======
var self;


this.initialize = function() {

	self = this;

	this.loadAllSounds();

}

this.loadAllSounds = function() {

	var allSounds = this.SoundSet;

	for (var i in allSounds) { 

   		var name = allSounds[i].soundName;
		var url = allSounds[i].soundURL;
		var looping = allSounds[i].isLooping;

   		var soundDefinition = allSounds[i];

    	var playMe = function() {
      		self.playSound(name);
    	}

    	this.loadSound(soundDefinition, playMe);

	}

}


//@ sourceURL=source/marsGameSound.js
>>>>>>> FETCH_HEAD
