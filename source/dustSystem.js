var self;

this.initialize = function() {

    self = this;
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

this.followTarget = function() {
    var camera = self.find( "//camera" )[ 0 ];
    var node = self.find( camera.targetPath )[ 0 ];
    self.translation = node.translation;
}

//@ sourceURL=source/dustSystem.js