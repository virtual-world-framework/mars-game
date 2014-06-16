var self;

this.initialize = function() {

    self = this;
    this.counter = 0;
    this.changeDirection();
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

this.changeDirection = function() {
    self.rotation = [ 0, 0, 1, self.rotation[ 3 ] + 10 ];
    this.future( 20 ).changeDirection();
}

this.followTarget = function() {
    var camera = self.find( "//camera" )[ 0 ];
    var node = self.find( camera.targetPath )[ 0 ];
    self.translation = node.translation;
}

//@ sourceURL=source/dustSystem.js