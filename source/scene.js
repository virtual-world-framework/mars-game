this.initialize = function() {

    var self = this;

    // Lay out the debris models
    // this.debris.bubble_lander.rotateBy( [ 1, 0, 0, -20 ] );

    // this.debris.bubble_lander_open.rotateBy( [ 0, 0, 1, 93.144 ] );

    // this.debris.o2_tank_1.rotateBy( [ 1, 0, 0, 90 ] );

    // this.debris.o2_tank_2.rotateBy( [ 1, 0, 0, 75 ] );
    // this.debris.o2_tank_2.rotateBy( [ 0, 1, 0, -90 ] );

    // this.debris.o2_tank_3.rotateBy( [ 1, 0, 0, 98.309 ] );
    // this.debris.o2_tank_3.rotateBy( [ 0, 1, 0, -16.27 ] );
    // this.debris.o2_tank_3.rotateBy( [ 0, 0, 1, 86.792 ] );

    // this.debris.o2_tank_4.rotateBy( [ 1, 0, 0, -15 ] );
    // this.debris.o2_tank_4.rotateBy( [ 0, 1, 0, -45 ] );
    // this.debris.o2_tank_4.rotateBy( [ 0, 0, 1, -160 ] );

    // this.debris.parachute2.rotateBy( [ 0, 0, 1, 70.0 ] );

    // this.debris.quadcon_storage_container_1.rotateBy( [ 0, 1, 0, -100 ] );

    // this.debris.quadcon_storage_container_2.rotateBy( [ 1, 0, 0, -22.673 ] );
    // this.debris.quadcon_storage_container_2.rotateBy( [ 0, 1, 0, -24.898 ] );
    // this.debris.quadcon_storage_container_2.rotateBy( [ 0, 0, 1, 84.486 ] );

    // this.debris.quadcon_storage_container_3.rotateBy( [ 1, 0, 0, 15.221 ] );
    // this.debris.quadcon_storage_container_3.rotateBy( [ 0, 1, 0, -9.656 ] );
    // this.debris.quadcon_storage_container_3.rotateBy( [ 0, 0, 1, 87.387 ] );
      
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.player.camera );

    this.graphObject = undefined;
    this.miniRover = undefined;
}

this.setScenario = function( path ) {
    var scenario = this.find( path )[ 0 ];
    if ( scenario ) {
        scenario.grid.clearGrid();
        scenario.future( 0 ).enter();
        this.scenarioChanged( scenario.name );
    } else {
        this.logger.warnx( "setScenario", "Scenario for path '" + path + "' not found." );
    }
}

this.resetScenario = function() {
    var scenario = this.find( this.activeScenarioPath )[ 0 ];
    if ( scenario ) {
        scenario.grid.clearGrid();        
        scenario.enter();
        this.scenarioReset( scenario.name );
    } else {
        this.logger.warnx( "resetScenario", "Invalid scenario path: " + this.activeScenarioPath );
    }
}

this.advanceScenario = function() {
    // HACK HACK HACK: For now, just reset the scenario (so it at least does someting)
    // TODO: make this actually advance to the next scenario (once we have more than
    //   one).
    this.resetScenario();
}

this.getCurrentScenario = function() {
    // TODO: make this handle more than one scenario
    return this.find( this.activeScenarioPath )[ 0 ];
}

this.createGraph = function() {

    var self = this;

    if ( self.graphObject === undefined ) {

        var graphDef = {
            "extends": "http://vwf.example.com/node3.vwf",
            "implements": [ "http://vwf.example.com/blockly/controller.vwf" ],
            "properties": {
                  "blockly_toolbox": "assets/scenario/graph.xml"
            }
        };

        self.children.create( "graph", graphDef, function( child ) {
            self.graphObject = child;
        } );
    }
}

this.removeGraph = function() {
    
    if ( this.graphObject !== undefined ) {
        this.children.delete( this.graphObject );
        this.graphObject = undefined;    
    }
    
}

this.createMiniRover = function() {

    var self = this;

    if ( self.miniRover === undefined ) {

        var miniroverDef = {
            "extends": "source/rover.vwf",
            "implements": [ "http://vwf.example.com/blockly/controller.vwf" ],
            "source": "assets/3d/minirover/minirover.dae",
            "type": "model/vnd.collada+xml",
            "properties": {
                "translation": [ 0, 9, 0 ],
                "rotation": [ 0, 0, 1, 270 ],
                "castShadows": true,
                "receiveShadows": true,
                "blocklyEnabled": false,
                "currentGridSquare": [ 2, 10 ],
                "heading": 270,
                "terrainName": "environment"
            }
        };

        self.children.create( "minirover", miniroverDef, function( child ) {
            self.miniRover = child;
        } );
    }
}

this.removeMiniRover = function() {
    
    if ( this.miniRover !== undefined ) {
        this.children.delete( this.miniRover );
        this.miniRover = undefined;    
    }
    
}



//@ sourceURL=source/scene.js