"use strict";

var self;
var instance;

this.initialize = function() {

    self = this;

    //Load sounds defined in yaml file
    for ( var i = 0; i < this.soundSet.length; ++i ) {
            this.loadSound( this.soundSet[i] );
    }

}

//@ sourceURL=source/marsGameSound.js
