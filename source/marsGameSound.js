var self;


this.initialize = function() {

	self = this;

	var name = this.SoundSet.Sound1.soundName;
	var url = this.SoundSet.Sound1.soundURL;
	//this.logger.errorx( "loadSound", num );
    var soundDefinition = { soundName: name, soundURL: url }
    var playMe = function() {
        self.playSound("laser");
    }
    this.loadSound(soundDefinition, playMe);

}

this.loadAllSounds = function() {
	
}


//@ sourceURL=source/marsGameSound.js