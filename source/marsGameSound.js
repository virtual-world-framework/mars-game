this.initialize = function() {

	//self = this;

	var notifyIsLoaded = function(){

	}

	this.loadAllSounds(notifyIsLoaded);

}

this.loadAllSounds = function(exitCallback) {

	for (var i in this.SoundSet) { 

		//Explore generators/promises here to track completion of all loading
   		var soundDefinition = this.SoundSet[i];
    	this.loadSound(this.SoundSet[i], exitCallback);

	}

}

this.playMenuMusic = function(){
	this.playSound(this.SoundSet[1]);
}

this.playMainMusic = function(){
	this.playSound(this.SoundSet[2]);
}

this.muteMainMusic = function(){
	
}

this.playWindSounds = function(){
	this.playSound(this.SoundSet[3]);
}

this.playRoverSounds = function(){
	this.playSound(this.SoundSet[0]);
}

this.stopAllSounds = function(){

}

//@ sourceURL=source/marsGameSound.js
