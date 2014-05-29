var self;
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

    if ( this.camera.pointOfView === "firstPerson" ) {
        // Switch to third person
        this.camera.pointOfView = "thirdPerson";
        this.blocklyButtonVisible = this.rover.blocklyButton.visible;
        this.future( delaySeconds ).setRoverVisible( true );
    } else {
        // Switch to first person
        this.camera.pointOfView = "firstPerson";
        this.blocklyButtonVisible = this.rover.blocklyButton.visible;
        this.future( durationSeconds - delaySeconds ).setRoverVisible( false );
    }
} 

this.setRoverVisible = function( vis ) {
    this.rover.visible = vis;
    this.rover.blocklyButton.visible = this.blocklyButtonVisible;
}
//@ sourceURL=player

