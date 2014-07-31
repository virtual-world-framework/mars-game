this.initialize = function() {
    this.future( 0 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

this.followTarget = function() {
    var camera = this.find( "//camera" )[ 0 ];
    this.translateTo( [
    		camera.translation[ 0 ] + 10,
    		camera.translation[ 1 ] + 10,
    		3
    	] );
}

//@ sourceURL=source/dustSystem.js