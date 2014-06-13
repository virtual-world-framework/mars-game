this.initialize = function() {
      
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.player.camera );

    this.graphObject = undefined;
    this.miniRover = undefined;
}

this.setScenario = function( path ) {
    var scenario = this.find( path )[ 0 ];
    if ( scenario ) {
        scenario.grid.clearGrid();
        scenario.future( 0 ).startScenario();
        this.scenarioChanged( scenario.name );
    } else {
        this.logger.warnx( "setScenario", "Scenario for path '" + path + "' not found." );
    }
}

this.resetScenario = function() {
    var scenario = this.find( this.activeScenarioPath )[ 0 ];
    if ( scenario ) {
        scenario.grid.clearGrid();        
        scenario.future( 0 ).startScenario();
        this.scenarioReset( scenario.name );
    } else {
        this.logger.warnx( "resetScenario", "Invalid scenario path: " + this.activeScenarioPath );
    }
}

this.advanceScenario = function() {
    var scenario = this.find( this.activeScenarioPath )[ 0 ];
    if ( scenario.nextScenarioPath ) {
        this.activeScenarioPath = scenario.nextScenarioPath;
    } else {
        this.logger.warnx( "advanceScenario", "nextScenarioPath not found." );
    }
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
                  "blockly_toolbox": "assets/scenario/graph.xml",
                  "isCollidable": false
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

this.addStatus = function( log ) {
    
    if ( this.status !== undefined ) {
        this.status.addLog( log );
    }
    
}

this.addAlert = function() {
    
    if ( this.alert !== undefined ) {
        this.alert.addLog( log );
    }
    
}
//@ sourceURL=source/scene.js