var gridBounds = {
    bottomLeft: [],
    topRight: []
}
var PASSABLE_COLOR = [ 220, 255, 220 ];
var IMPASSABLE_COLOR = [ 255, 220, 220 ];
var OPACITY = 0.3;
var NORMAL = [ 0, 0, 1 ];
var ROTATION = 90;
var RENDERTOP = true;
var SIZE = 0.9;
var tiles = new Array();

this.initialize = function() {
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.player.camera );
    this.setUpCameraListener();
}

this.setScenario = function( path ) {
    var scenario = this.find( path )[ 0 ];
    if ( scenario ) {
        if ( scenario.grid && scenario.grid.clearGrid ) {
            scenario.grid.clearGrid();
        }
        scenario.future( 0 ).startScenario();
        calcGridBounds( scenario.grid );
        this.scenarioChanged( scenario.name, gridBounds );
    } else {
        this.logger.warnx( "setScenario", "Scenario for path '" + path + "' not found." );
    }
}

this.resetScenario = function() {
    var scenario = this.find( this.activeScenarioPath )[ 0 ];
    if ( scenario ) {
        if ( scenario.grid && scenario.grid.clearGrid ) {
            scenario.grid.clearGrid();
        }      
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

this.addSubtitle = function( log, time ) {

    if ( this.subtitles !== undefined ) {    
        this.subtitles.addSubtitle( log, time );
    }
}

this.createGridDisplay = function( grid ) {
    var origin, color;
    var offset = new Array();
    offset.push( grid.gridOriginInSpace[ 0 ] / grid.gridSquareLength );
    offset.push( grid.gridOriginInSpace[ 1 ] / grid.gridSquareLength );
    tiles.length = 0;
    for ( var x = 0; x < grid.boundaryValues.length; x++ ) {
        for ( var y = 0; y < grid.boundaryValues[ x ].length; y++ ) {
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
                "doubleSided": false,
                "renderTop": RENDERTOP
            } } );
        }
    }
    this.gridTileGraph.mapTiles.graphObjects = tiles;
}

function calcGridBounds( grid ) {
    grid.getWorldFromGrid( grid.minX, grid.minY, gridBounds.bottomLeft );
    grid.getWorldFromGrid( grid.maxX, grid.maxY, gridBounds.topRight );
}

this.executeBlock = function ( block, action ) {
    var blockName = block[ 0 ];
    var blockID = block[ 1 ];
    this.blockExecuted( blockName, blockID );

    var nodeID = action[ 0 ];
    var methodName = action[ 1 ];
    var args = action[ 2 ];
    var node = this.findByID( this, nodeID );
    if ( node ) {
        args = args instanceof Array ? args : [ args ];
        node[ methodName ].apply( node, args );
    }
}

this.setUpCameraListener = function() {
    var scene = this;
    this.player.camera.changedPOV = function( pov ) {
        if ( pov !== "topDown") {
            scene.displayTiles( false );
            scene.displayGraph( false );
        }
    }
}

this.displayTiles = function( isVisible ) {
    this.gridTileGraph.mapTiles.groupVisible = isVisible;
    if ( isVisible && this.player.camera.pointOfView !== "topDown" ) {
        this.player.camera.pointOfView = "topDown";
    }
    this.toggledTiles( isVisible );
}

this.displayGraph = function( isVisible ) {
    this.blocklyGraph.setGraphVisibility( isVisible );
    if ( isVisible && this.player.camera.pointOfView !== "topDown" ) {
        this.player.camera.pointOfView = "topDown";
    }
    this.toggledGraph( isVisible );
}

//@ sourceURL=source/scene.js