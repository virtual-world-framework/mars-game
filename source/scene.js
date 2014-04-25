this.initialize = function() {

  this.initializeActiveCamera( this.player.camera );
  
}

this.checkForSuccess = function() {

	var playerRover, gridSquare, roverIsOnGoal, roverHasRadio;

	playerRover = this.player.rover;
	gridSquare = playerRover.currentGridSquare;
	roverIsOnGoal = playerRover.boundaryMap[ gridSquare[0] ][ gridSquare[1] ] === 0;
	roverHasRadio = !!( playerRover.find("*/radio")[0] );

	if ( roverIsOnGoal && roverHasRadio ) {
		this.scenarioSucceeded();
	}

}

//@ sourceURL=source/scene.js