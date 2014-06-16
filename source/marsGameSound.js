"use strict";

var self;
var roverSoundInstance;
var soundInstances;

this.initialize = function() {

    self = this;
    soundInstances = {};

    //Load sounds defined in yaml file
    for ( var i = 0; i < this.soundSet.length; ++i ) {
            this.loadSound( this.soundSet[i] );
    }

}

this.playSoundAndRetain = function( soundName ){
	soundInstances[ soundName ] = this.playSound( soundName );
}

this.stopSound = function( soundName ){
	this.stopSoundInstance( soundInstances[ soundName ] );
}

//@ sourceURL=source/marsGameSound.js
