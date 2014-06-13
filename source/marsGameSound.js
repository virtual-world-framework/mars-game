"use strict";

var self;
var instance;
var roverSounds;

this.initialize = function() {

    self = this;
    roverSounds = undefined;

    //Load sounds defined in yaml file
    for ( var i = 0; i < this.soundSet.length; ++i ) {
            this.loadSound( this.soundSet[i] );
    }

}


this.startRoverSounds = function() {

	if (roverSounds === undefined){
		roverSounds = {};
		roverSounds[ 0 ] = this.playSound('objectRoverMovementGroundCrunch');
		roverSounds[ 1 ] = this.playSound('objectRoverMotor');
	}

}

this.stopRoverSounds = function() {

	this.stopSoundInstance( roverSounds[ 0 ] );
	this.stopSoundInstance( roverSounds[ 1 ] );
	roverSounds = undefined;

}

this.stopMotorSound = function() {

	this.stopSoundInstance( roverSounds[ 1 ] );
	roverSounds [ 1 ] = undefined;

}

this.startMotorSound = function() {

	if ( roverSounds [ 1 ] === undefined ){
		roverSounds[ 1 ] = this.playSound('objectRoverMotor');
	}

}
//@ sourceURL=source/marsGameSound.js
