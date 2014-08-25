var camera;

this.isBlinking = false;

this.initialize = function() {
    this.blink();
}

this.callOut = function( coords ) {
    camera = this.find( "/player/targetFollower/camera" )[ 0 ];
    coords[ 0 ] /= this.parent.graphScale;
    coords[ 1 ] /= this.parent.graphScale;
    coords[ 2 ] /= this.parent.graphScale;
    this.origin = coords;
    this.isBlinking = true;
}

this.blink = function() {
    if ( this.isBlinking ) {
        if ( camera.pointOfView === "topDown" ) {
            this.visible = !this.visible;
        } else {
            this.visible = false;
        }
    } else {
        this.visible = false;
    }
    this.future( 0.5 ).blink();
}
this.stopBlink = function() {
    this.isBlinking = false;
}

//@ sourceURL=source/callouttile.js