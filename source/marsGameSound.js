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
        this.soundStarted = this.events.add( function( instanceHandle ) {
            if ( this.hasSubtitle( instanceHandle ) ) {

                var subtitle = this.getSubtitle( instanceHandle );
                scene.addSubtitle( subtitle );

                //Parse subtitle to find the character image to display
                var character = subtitle.split( ":" )[ 0 ];
                if ( character ) {
                    character = character.slice( 1, character.length - 1 );
                    var imagePath = "";
                    if ( character === "ROVER" ) {
                        var imagePath = "assets/images/hud/comms_rover.png";
                    } else if ( character === "MC" ) {
                        var imagePath = "assets/images/hud/comms_missioncontrol.png";
                    }
                    scene.showCommsImage( imagePath );
                }                
            }
        } );

        this.soundFinished = this.events.add( function( instanceHandle ) {
            if ( this.hasSubtitle( instanceHandle ) ) {
                scene.hideCommsImage();
            }
        } );
    }
}
//@ sourceURL=source/marsGameSound.js
