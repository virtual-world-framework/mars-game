this.initialize = function() {

	self = this;

	this.loadAllSounds();

}

this.loadAllSounds = function() {

	var allSounds = this.SoundSet;

	for (var i in allSounds) { 

   		var soundDefinition = allSounds[i];

    	var playMe = function() {
      		self.playSound("laser");
    	}

    	this.loadSound(soundDefinition, playMe);

	}

}


//@ sourceURL=source/marsGameSound.js
