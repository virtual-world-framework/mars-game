this.initialize = function() {
    this.future( 0 ).setUpEvents();
}

this.setUpEvents = function() {
    var scene = this.find( "/" )[ 0 ];
    if ( !scene || scene.name !== "application" ) {
        return;
    }

    var cam = scene.player.camera;
    cam.transformChanged = cam.events.add( this.followCamera, this );
}

this.followCamera = function( camTransform ) {
    var camPos = [ camTransform[ 12 ], camTransform[ 13 ], 0 ];
    var offset = this.offsetFromTarget;
    var newPos = [ camPos[ 0 ] + offset[ 0 ],
                   camPos[ 1 ] + offset[ 1 ],
                   camPos[ 2 ] + offset[ 2 ] ];
    this.target = camPos;
    this.translateTo( newPos );
}