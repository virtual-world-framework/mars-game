var self;
var firstPersonTransform = [ 1, 0, 0, 0,  0, 1,      0,     0,  0, 0,     1,     0,  0,   0,  1, 0 ];
var thirdPersonTransform = [ 1, 0, 0, 0,  0, 0.707, -0.707, 0,  0, 0.707, 0.707, 0,  0, -55, 55, 1 ];

this.initialize = function() {
    self = this;
    this.future( 0 ).initializeEventHandlers();
}

this.initializeEventHandlers = function() {
    this.rover.moved = function( displacement ) {
        firstPersonTransform[ 12 ] += displacement[ 0 ];
        firstPersonTransform[ 13 ] += displacement[ 1 ];
        firstPersonTransform[ 14 ] += displacement[ 2 ];
        thirdPersonTransform[ 12 ] += displacement[ 0 ];
        thirdPersonTransform[ 13 ] += displacement[ 1 ];
        thirdPersonTransform[ 14 ] += displacement[ 2 ];
        self.camera.translateBy( displacement, 1 );
    }
}

this.togglePerspective = function() {
    var durationSeconds = 1;
    var delaySeconds = 0.1;

    if ( this.camera.isFirstPerson ) {
        // Switch to third person
        this.camera.transformTo( thirdPersonTransform, durationSeconds );
        this.rover.future( delaySeconds ).visible = true;
        this.camera.navmode = "none";
        this.camera.isFirstPerson = false;
    } else {
        // Switch to first person
        this.camera.transformTo( firstPersonTransform, durationSeconds );
        this.rover.future( durationSeconds - delaySeconds ).visible = false;
        this.camera.future( durationSeconds ).navmode = "walk";
        this.camera.isFirstPerson = true;
    }
} //@ sourceURL=player

