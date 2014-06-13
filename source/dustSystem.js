var self;
var windDirection;
var maxScalar;
var minScalar;
var camera;

this.initialize = function() {

    self = this;
    windDirection = [ 1, 1, 0 ];
    this.minVelocity = [ 0, 0, 0 ];
    maxScalar = 0.2;
    minScalar = 0;
    this.future( 0.05 ).update();
}

this.update = function() {
    self.translation = [ 0, 0, 0];
    for ( var i = 0; i < windDirection.length; i++ ) {
        self.maxVelocity[ i ] = maxScalar * windDirection[ i ];
        //self.minVelocity[ i ] = minScalar * windDirection[ i ];
    }
    this.future( 0.05 ).update();
}

this.followPlayer = function() {

}

//@ sourceURL=source/dustSystem.js