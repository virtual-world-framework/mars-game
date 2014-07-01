this.initialize = function() {
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

this.followTarget = function() {
    var camera = this.find( "//camera" )[ 0 ];
    var node = this.find( camera.targetPath )[ 0 ];
    this.translation = node.translation;
}

//@ sourceURL=source/dustSystem.js