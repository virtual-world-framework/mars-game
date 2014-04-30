var self = this;
var cachedScene;

this.entering = function() {
    var scene = getScene();

    // Check for success
    scene.pickups.radio.pickedUp = this.events.add( function() {
        self.checkForSuccess();
    } );
    scene.player.rover.moved = this.events.add( function() {
        self.checkForSuccess();
    } );

    // Check for failure
    scene.player.rover.moveFailed = this.events.add( function() {
        self.checkForFailure();
    } );
}

this.checkForSuccess = function() {

    var playerRover, gridSquare, roverIsOnGoal, roverHasRadio;
    var scene = getScene();

    playerRover = scene.player.rover;
    gridSquare = playerRover.currentGridSquare;
    roverIsOnGoal = ( ( gridSquare[ 0 ] === 15 ) && ( gridSquare[ 1 ] === 7 ) );
    roverHasRadio = !!( playerRover.find("*/radio")[0] );

    if ( roverIsOnGoal && roverHasRadio ) {
        self.completed();
    }

}

this.checkForFailure = function() {
    self.failed();
}

function getScene() {
    if ( !cachedScene ) {
        var searchArray = self.find( self.scenePath );
        if ( searchArray.length ) {
            cachedScene = searchArray[ 0 ];
        }
    }
    return cachedScene;
}

//@ sourceURL=source/scenario1.js