this.initialize = function() {
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

this.followTarget = function() {
    var camera = this.find( "//camera" )[ 0 ];
    this.translateTo( [
    		camera.translation[ 0 ],
    		camera.translation[ 1 ],
    		0
    	] );
}

//@ sourceURL=source/dustSystem.js