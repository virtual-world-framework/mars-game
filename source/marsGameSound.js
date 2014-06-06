this.initialize = function() {

	self = this;

	this.loadAllSounds();

}

this.loadAllSounds = function(failureCallback,successCallback) {

	var allSounds = this.SoundSet;

	for (var i in allSounds) { 

   		var soundDefinition = allSounds[i];

    	var playMe = function() {
    		//self.playSound('laser')
    	}

    	self.loadSound(allSounds[i], playMe);

	}

}

this.playMenuMusic = function(){
	self.playSound('menu');
}

this.playMainMusic = function(){
	self.playSound('gameplay');
}

this.playWind = function(){
	self.playSound('wind');
}

this.playRoverSounds = function(){
	self.playSound('rover');
}

//@ sourceURL=source/marsGameSound.js
