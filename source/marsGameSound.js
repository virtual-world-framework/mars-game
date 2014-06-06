this.initialize = function() {

	self = this;

	this.loadAllSounds();

}

this.loadAllSounds = function() {

	var allSounds = this.SoundSet;

	for (var i in allSounds) { 

   		var soundDefinition = allSounds[i];

    	var playMe = function() {
    		//self.playSound('laser')
    	}

    	self.loadSound(soundDefinition, playMe);

	}

}

this.playMainMusic = function(){
	self.playSound('gameplay');
}

//@ sourceURL=source/marsGameSound.js
