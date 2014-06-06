this.initialize = function() {

	self = this;

	var notifyIsLoaded = function(){
		self.allSoundsLoaded = true;
	}

	this.loadAllSounds(notifyIsLoaded);

}

this.loadAllSounds = function(exitCallback) {

	for (var i in this.SoundSet) { 

		//Explore generators/promises here to track completion of all loading
   		var soundDefinition = this.SoundSet[i];
    	self.loadSound(this.SoundSet[i], exitCallback);

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
