var cameraPos = new Array( 3 );
var newPos = new Array( 3 );
var tf, cam;

this.initialize = function() {
    this.future( 0 ).setUpEvents();
}

this.setUpEvents = function() {
    var scene = this.find( "/" )[ 0 ];
    if ( !scene || scene.name !== "application" ) {
        return;
    }
    tf = scene.player.targetFollower;
    cam = tf.camera;
    tf.transformChanged = tf.events.add( this.followCamera, this );
    cam.transformChanged = cam.events.add( this.followCamera, this );
}

this.followCamera = function() {
    cameraPos[ 0 ] = Math.round( tf.transform[ 12 ] + cam.transform[ 12 ] );
    cameraPos[ 1 ] = Math.round( tf.transform[ 13 ] + cam.transform[ 13 ] );
    cameraPos[ 2 ] = 0;
    var offset = this.offsetFromTarget;
    newPos[ 0 ] = cameraPos[ 0 ] + offset[ 0 ];
    newPos[ 1 ] = cameraPos[ 1 ] + offset[ 1 ];
    newPos[ 2 ] = cameraPos[ 2 ] + offset[ 2 ];
    this.target = cameraPos;
    this.translateTo( newPos );
}

//@ sourceURL=source/lights.js