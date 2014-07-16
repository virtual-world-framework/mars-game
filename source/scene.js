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
        var gridBounds = calcGridBounds( scenario.grid );
        this.scenarioChanged( scenario.name, gridBounds );
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
                "terrainName": "environment",
                "displayName": "Minirover"
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
        var fontSize = parseInt( $( ".statusText").css( "font-size" ) );
        var textWidth = parseInt( $( ".statusText" ).css( "width" ) );
        var width = textWidth / fontSize * 1.7;
        this.status.addLogWithLimit( log, width );
    }
    
}

this.addAlert = function( log ) {
    
    if ( this.alerts !== undefined ) {
        var fontSize = parseInt( $( ".alertText").css( "font-size" ) );
        var textWidth = parseInt( $( ".alertText" ).css( "width" ) );
        var width = textWidth / fontSize * 1.7;        
        this.alerts.addLogWithLimit( log, width );
    }
    
}

this.addSubtitle = function( log ) {

    if ( this.subtitles !== undefined ) {    
        this.subtitles.addLog( log );
    }
}

this.createGridDisplay = function( grid ) {
    var PASSABLE_COLOR = [ 220, 255, 220 ];
    var IMPASSABLE_COLOR = [ 255, 220, 220 ];
    var OPACITY = 0.5;
    var NORMAL = [ 0, 0, 1 ];
    var ROTATION = 90;
    var RENDERTOP = true;
    var SIZE = 0.8;
    var origin, name, color;
    var tiles = new Array;

    var offset = new Array(); 
    offset.push( grid.gridOriginInSpace[ 0 ] / grid.gridSquareLength );
    offset.push( grid.gridOriginInSpace[ 1 ] / grid.gridSquareLength );

    for ( var x = 0; x < grid.boundaryValues.length; x++ ) {

        for ( var y = 0; y < grid.boundaryValues[ x ].length; y++ ) {

            name = "tile_" + x + "_" + y;

            origin = [
                offset[ 0 ] + ( x ),
                offset[ 1 ] + ( y ),
                0
            ];

            color = grid.boundaryValues[ x ][ y ] === -1 ? IMPASSABLE_COLOR : PASSABLE_COLOR;
            
            tiles.push( { "plane": {
                "origin": origin,
                "normal": NORMAL,
                "rotationAngle": ROTATION,
                "size": SIZE,
                "color": color,
                "opacity": OPACITY,
                "renderTop": RENDERTOP
            } } );

        }

    }

    this.gridTileGraph.graphGroup(
        this.gridTileGraph.tileVisible,
        tiles
    );
}

this.removeGridDisplay = function() {
    var graph = this.gridTileGraph;

    for ( var obj in graph.children ) {
        graph.children.delete( graph.children[ obj ] );
    }
}

function calcGridBounds( grid ) {
    var gridBounds = {  bottomLeft: grid.getWorldFromGrid( [ grid.minX, grid.minY ] ),
                        topRight: grid.getWorldFromGrid( [ grid.maxX, grid.maxY ] ) };
    return gridBounds;
}

this.blockExecuted = function ( block, action ) {
    var blockName = block[ 0 ];
    var blockID = block[ 1 ];
    this.blockFired( blockName, blockID );

    var nodeID = action[ 0 ];
    var methodName = action[ 1 ];
    var args = action[ 2 ];
    var node = this.findByID( this, nodeID );
    if ( node ) {
        node[ methodName ]( action.args );
    }
}

//@ sourceURL=source/scene.js