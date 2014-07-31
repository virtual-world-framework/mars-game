var cameraPos = new Array( 3 );
var newPos = new Array( 3 );

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
    camPos[ 0 ] = Math.round( camTransform[ 12 ];
    camPos[ 1 ] = Math.round( camTransform[ 13 ];
    camPos[ 2 ] = 0;
    var offset = this.offsetFromTarget;
    newPos[ 0 ] = camPos[ 0 ] + offset[ 0 ];
    newPos[ 1 ] = camPos[ 1 ] + offset[ 1 ];
    newPos[ 2 ] = camPos[ 2 ] + offset[ 2 ];
    this.target = camPos;
    this.translateTo( newPos );
}

//@ sourceURL=source/lights.js