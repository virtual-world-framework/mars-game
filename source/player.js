var self;
var thirdPersonOrientationTransform = [ 
      0    , -1,  0    , 0, 
      0.963,  0, -0.27 , 0,
      0.27 ,  0,  0.963, 0,
      0,      0,  0,     1 ];
var firstPersonOffset = [ 0, 0, 1 ];
var thirdPersonOffset = [ -15.531,  0,  5.553 ];

this.initialize = function() {
    self = this;
    this.blocklyButtonVisible = this.rover.blocklyButton.visible;
    this.future( 0 ).initializeEventHandlers();
}

this.initializeEventHandlers = function() {
    this.rover.transformChanged = function( transform ) {
        if ( self.camera.isFirstPerson ) {
            var firstPersonTransform = transform.slice( 0, 16 );
            firstPersonTransform[ 12 ] += firstPersonOffset[ 0 ];
            firstPersonTransform[ 13 ] += firstPersonOffset[ 1 ];
            firstPersonTransform[ 14 ] += firstPersonOffset[ 2 ];
            self.camera.transform = firstPersonTransform;
        } else {
            self.camera.translation = [ 
                transform[ 12 ] + thirdPersonOffset[ 0 ],
                transform[ 13 ] + thirdPersonOffset[ 1 ],
                transform[ 14 ] + thirdPersonOffset[ 2 ] ];
        }
    }
}

this.togglePerspective = function() {
    var durationSeconds = 1;
    var delaySeconds = 0.1;

    if ( this.camera.isFirstPerson ) {
        // Switch to third person
        var thirdPersonTransform = thirdPersonOrientationTransform.slice( 0, 16 );
        thirdPersonTransform[ 12 ] = this.rover.transform[ 12 ] + thirdPersonOffset[ 0 ];
        thirdPersonTransform[ 13 ] = this.rover.transform[ 13 ] + thirdPersonOffset[ 1 ];
        thirdPersonTransform[ 14 ] = this.rover.transform[ 14 ] + thirdPersonOffset[ 2 ];
        this.camera.transformTo( thirdPersonTransform, durationSeconds );
        this.blocklyButtonVisible = this.rover.blocklyButton.visible;
        this.future( delaySeconds ).setRoverVisible( true );
        this.camera.navmode = "none";
        this.camera.isFirstPerson = false;
    } else {
        // Switch to first person
        var firstPersonTransform = this.rover.transform.slice( 0, 16 );
        firstPersonTransform[ 12 ] += firstPersonOffset[ 0 ];
        firstPersonTransform[ 13 ] += firstPersonOffset[ 1 ];
        firstPersonTransform[ 14 ] += firstPersonOffset[ 2 ];
        this.camera.transformTo( firstPersonTransform, durationSeconds );
        this.blocklyButtonVisible = this.rover.blocklyButton.visible;
        this.future( durationSeconds - delaySeconds ).setRoverVisible( false );
        this.camera.future( durationSeconds ).navmode = "walk";
        this.camera.isFirstPerson = true;
    }
} 

this.setRoverVisible = function( vis ) {
    this.rover.visible = vis;
    this.rover.blocklyButton.visible = this.blocklyButtonVisible;
}
//@ sourceURL=player

