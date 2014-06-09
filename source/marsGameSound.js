"use strict";

var self;

this.initialize = function() {
    self = this;

    for ( var i = 0; i < this.soundSet.length; ++i ) {
        this.loadSound(this.soundSet[i]);
    }

    // var loadNext = function (i){
    //  if (self.SoundSet[i] === undefined) {

    //  }else{
    //      self.loadSound(self.SoundSet[i],loadNext(i+1));
    //  }
    // }
 //    this.loadSound(this.SoundSet[0],loadNext(1));

}

this.loadAllSounds = function(exitCallback) {

    //Explore generators/promises here to track completion of all loading



    

}


this.playMenuMusic = function(){
    this.playSound("menu");
    this.playSound(this.SoundSet[1].name);
}

this.playMainMusic = function(){
    this.playSound("")
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
