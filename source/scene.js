this.initialize = function() {

    var self = this;

    // Lay out the debris models
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
      
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.player.camera );

    // Activate the minirover when the user picks up the radio
    this.pickups.radio.pickedUp = function() {
        self.minirover.noComm.visible = false;
        self.minirover.showButton = true;
    }

    // Deactivate the minirover when the user picks up the radio
    this.pickups.radio.dropped = function() {
        self.minirover.noComm.visible = true;
        self.minirover.showButton = false;
    }

    // Start the first scenario
    this.scenario1.future(0).enter();

}

//@ sourceURL=source/scene.js