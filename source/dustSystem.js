var self;
var windDirection;
var maxScalar;
var minScalar;

this.initialize = function() {

    self = this;
    windDirection = [ 1, 1, 0 ];
    maxScalar = 0.01;
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();

    this.future( 0.05 ).update();
}

this.changeDirection = function() {
    windDirection = [ -1, -1, 0 ];
    for ( var i = 0; i < windDirection.length; i++ ) {
        self.maxVelocity[ i ] = maxScalar * windDirection[ i ];
    }
    this.future( 100 ).changeDirection();
}

this.followTarget = function() {
    var camera = self.find( "//camera" )[ 0 ];
    var node = self.find( camera.targetPath )[ 0 ];
    self.translation = node.translation;
}

//@ sourceURL=source/dustSystem.js