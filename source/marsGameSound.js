"use strict";

var self;

var menuInstance;
var mainInstance;
var windInstance;
var roverMotorInstance;
var roverTreadsInstance;

this.initialize = function() {

    self = this;

    var done = function ( name ){
        //console.log('Sound '+name+' loaded.');
    }
    
    //Load sounds defined in yaml file

    for ( var i = 0; i < this.soundSet.length; ++i ) {
        this.loadSound(this.soundSet[i], done(this.soundSet[i].soundName) );
    }

}


this.playMenuMusic = function(){

    if (menuInstance === undefined){
        menuInstance = this.playSound("menu");
        //fade in
        //this.setVolume(menuInstance,1.0,2.0,'exponential');
    }

}

this.stopMenuMusic = function(){

    this.stopSoundInstance(menuInstance);
    menuInstance = undefined;
}

this.fadeInMainMusic = function(){

    if (mainInstance === undefined) {
        mainInstance = this.playSound("gameplay");

        //fade in
        this.setVolume(mainInstance,1.0,3.0,'exponential');
    }

}

this.fadeOutMainMusic = function(){

    //fade out
    this.setVolume(mainInstance,0.0,3.0,'exponential');

}

this.stopMainMusic = function(){

    this.stopSoundInstance(mainInstance, true);
    mainInstance = undefined;

}

this.playRoverSounds = function(){

    if (roverMotorInstance === undefined && roverTreadsInstance === undefined) {
        roverMotorInstance = this.playSound("rover_motor");
        roverTreadsInstance = this.playSound("rover_treads");
    }
    //fade in
   // this.setVolume(roverInstance,1.0,0.5,'exponential');
}

this.stopRoverSounds = function(){

    this.stopSoundInstance(roverMotorInstance);
    this.stopSoundInstance(roverTreadsInstance);
    roverTreadsInstance = undefined;
    roverMotorInstance = undefined;

}

this.fadeInWindSounds = function(){
  
    if (windInstance === undefined){
        windInstance = this.playSound("wind")

<<<<<<< HEAD
        //fade in
        this.setVolume( windInstance, 1.0 , 1.0 , 'exponential');
    }
}

this.stopWindSounds = function(){
=======
    	var playMe = function() {
    		//self.playSound('laser')
    	}

    	self.loadSound(soundDefinition, playMe);
>>>>>>> c9d482c... Finally back to point before rebase errors

    this.stopSoundInstance( windInstance, true);
    windInstance = undefined;

}

<<<<<<< HEAD
this.fadeOutWindSounds = function(){
=======
this.playMainMusic = function(){
	self.playSound('gameplay');
}
>>>>>>> c9d482c... Finally back to point before rebase errors

    //fade out
    this.setVolume( windInstance , 0.0 , 3.0 ,'exponential');

}
//@ sourceURL=source/marsGameSound.js
