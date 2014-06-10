"use strict";

var self;

var menuInstance;
var mainInstance;
var windInstance;
var roverInstance;

this.initialize = function() {

    self = this;

    for ( var i = 0; i < this.soundSet.length; ++i ) {
        this.loadSound(this.soundSet[i]);
    }

}


this.playMenuMusic = function(){

	var newSoundInstance;

    newSoundInstance = this.playSound("menu");
    menuInstance = newSoundInstance;
    //fade in
    this.setVolume(menuInstance,1.0,2.0,'exponential');

}

this.stopMenuMusic = function(){

    this.stopSoundInstance(menuInstance);

}

this.playMainMusic = function(){
    var newSoundInstance;

    newSoundInstance = this.playSound("gameplay");

    mainInstance = newSoundInstance;
    //fade in
    this.setVolume(mainInstance,1.0,3.0,'exponential');
}

this.stopMainMusic = function(){

    this.stopSoundInstance(mainInstance, 'layered');

}

this.playWindSounds = function(){
   
    var newSoundInstance;

    newSoundInstance = this.playSound("wind")
    windInstance = newSoundInstance;
    //fade in
    this.setVolume(windInstance,1.0,1.0,'exponential');
}


this.stopWindSounds = function(){
	this.stopSoundInstance(windInstance, 'layered');
}
this.playRoverSounds = function(){
    var newSoundInstance;

    newSoundInstance = this.playSound("rover");
    roverInstance = newSoundInstance;
    //fade in
    this.setVolume(roverInstance,1.0,0.5,'exponential');
}

this.stopRoverSounds = function(){

	this.stopSoundInstance(roverInstance);

}


//@ sourceURL=source/marsGameSound.js
