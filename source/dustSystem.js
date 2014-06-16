var self;
var count;
var rotation;
var maxDirectionChange;

this.initialize = function() {

    self = this;
    count = 0;
    rotation = 0;
    maxDirectionChange = 30;
    this.changeDirection();
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}

//Rotates system by maxDirectionChange to simulate wind changing
this.changeDirection = function() {

    rotation++;
    if ( rotation > 360 ) {
        rotation = 0;
    }
    self.rotation = [ 0, 0, 1, rotation ];

    //Make the rotation look smooth
    if ( count < maxDirectionChange ) {
        count++;
        this.future( 0.05 ).changeDirection();
    } else {
        count = 0;
        this.future( 50 ).changeDirection();
    }
}

this.followTarget = function() {
    var camera = self.find( "//camera" )[ 0 ];
    var node = self.find( camera.targetPath )[ 0 ];
    self.translation = node.translation;
}

//@ sourceURL=source/dustSystem.js