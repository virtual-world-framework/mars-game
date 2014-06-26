"use strict";

var self;
var setUpOnce = true;

this.initialize = function() {

    self = this;

    //Load sounds defined in yaml file
    for ( var i = 0; i < this.soundSet.length; ++i ) {
            this.loadSound( this.soundSet[i] );
    }

    this.future( 0 ).setUpSubtitles();
}

this.setUpSubtitles = function() {

    var scene = this.find( "/" )[ 0 ];

    if ( scene && setUpOnce ) {
        setUpOnce = false;
        this.playSubtitle = this.events.add( function( message ) {
            scene.addSubtitle( message );
        });
    }
}
//@ sourceURL=source/marsGameSound.js
