this.initialize = function() {

    this.debris.ac_unit.rotateBy( [ 1, 0, 0, -3.609 ] );
    this.debris.ac_unit.rotateBy( [ 0, 1, 0, -20.793 ] );
    this.debris.ac_unit.rotateBy( [ 0, 0, 1, -125.919 ]  );

    this.debris.bubble_lander.rotateBy( [ 1, 0, 0, -20 ] );

    this.debris.bubble_lander_open.rotateBy( [ 0, 0, 1, 93.144 ] );

    this.debris.o2_tank_1.rotateBy( [ 1, 0, 0, 90 ] );

    this.debris.o2_tank_2.rotateBy( [ 1, 0, 0, 75 ] );
    this.debris.o2_tank_2.rotateBy( [ 0, 1, 0, -90 ] );

    this.debris.o2_tank_3.rotateBy( [ 1, 0, 0, 98.309 ] );
    this.debris.o2_tank_3.rotateBy( [ 0, 1, 0, -16.27 ] );
    this.debris.o2_tank_3.rotateBy( [ 0, 0, 1, 86.792 ] );

    this.debris.o2_tank_4.rotateBy( [ 1, 0, 0, -15 ] );
    this.debris.o2_tank_4.rotateBy( [ 0, 1, 0, -45 ] );
    this.debris.o2_tank_4.rotateBy( [ 0, 0, 1, -160 ] );

    this.debris.parachute2.rotateBy( [ 0, 0, 1, 70.0 ] );

    this.debris.quadcon_storage_container_1.rotateBy( [ 0, 1, 0, -100 ] );

    this.debris.quadcon_storage_container_2.rotateBy( [ 1, 0, 0, -22.673 ] );
    this.debris.quadcon_storage_container_2.rotateBy( [ 0, 1, 0, -24.898 ] );
    this.debris.quadcon_storage_container_2.rotateBy( [ 0, 0, 1, 84.486 ] );

    this.debris.quadcon_storage_container_3.rotateBy( [ 1, 0, 0, 15.221 ] );
    this.debris.quadcon_storage_container_3.rotateBy( [ 0, 1, 0, -9.656 ] );
    this.debris.quadcon_storage_container_3.rotateBy( [ 0, 0, 1, 87.387 ] );
      
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