// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

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

var lastCameraPOV = "thirdPerson";

this.initialize = function() {
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.player.targetFollower.camera );
    this.setUpCameraListener();
    this.future( 0 ).setAnimationRate();
}

this.setAnimationRate = function() {
    this.find( "doc('http://vwf.example.com/animation.vwf')" )[ 0 ].animationTPS = 30;
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
    var scenario = this.getCurrentScenario();
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
    var scenario = this.getCurrentScenario();
    if ( scenario.nextScenarioPath ) {
        this.activeScenarioPath = scenario.nextScenarioPath;
    } else {
        this.logger.warnx( "advanceScenario", "nextScenarioPath not found." );
    }
}

this.getScenarioPaths = function() {
    var scenarios = this.getScenarios();
    var paths = new Array();
    for ( var i = 0; i < scenarios.length; i++ ) {
        paths.push( scenarios[ i ].name );
    }
    this.gotScenarioPaths( paths );
}

this.getScenarios = function() {
    var scenarios = this.find( ".//element(*,'source/scenario/scenario.vwf')" );
    return scenarios;
}

this.getCurrentScenario = function() {
    // TODO: make this handle more than one scenario
    return this.find( this.activeScenarioPath )[ 0 ];
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
            if ( grid.boundaryValues[ x ][ y ] === -1 ) {
                continue;
            }
            origin = [
                offset[ 0 ] + ( x ),
                offset[ 1 ] + ( y ),
                0
            ];
            color = PASSABLE_COLOR;
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
    this.player.targetFollower.camera.changedPOV = function( pov ) {
        if ( pov !== "topDown") {
            scene.displayTiles( false );
            scene.displayGraph( false );
        }
    }
}

this.displayTiles = function( isVisible ) {
    this.gridTileGraph.mapTiles.groupVisible = isVisible;
    if ( isVisible && this.player.targetFollower.camera.pointOfView !== "topDown" ) {
        this.player.targetFollower.camera.pointOfView = "topDown";
    }
    this.toggledTiles( isVisible );
}

this.displayGraph = function( isVisible ) {
    this.blocklyGraph.setGraphVisibility( isVisible );
    if ( isVisible && this.player.targetFollower.camera.pointOfView !== "topDown" ) {
        this.player.targetFollower.camera.pointOfView = "topDown";
    }
    this.toggledGraph( isVisible );
    this.blocklyGraph.blocklyLine.visible = isVisible;
}

this.setCinematicView = function( pose ) {
    var camera = this.player.targetFollower.camera;
    lastCameraPOV = camera.pointOfView;
    camera.pointOfView = "thirdPerson";
    if ( pose ) {
        camera.setCameraPose( pose );
    }
}

this.resetView = function() {
    var camera = this.player.targetFollower.camera;
    if ( lastCameraPOV === camera.pointOfView ) {
        camera.setNavigationFromPOV( lastCameraPOV );
    } else {
        camera.pointOfView = lastCameraPOV;
    }
}

this.restartGame = function() {
    this.sceneBlackboard = {};
    this.soundManager.stopAllSoundInstances();
    this.activeScenarioPath = "mainMenuScenario";
}

this.attemptLogin = function( userID ) {
    this.playerId = userID;
    this.instrumentationManager.getRequest( "getPlayerState" );
}

this.loginFailed = function( responseText ) {
    console.log( responseText );
}

this.loginSucceeded = function( scenarioName ) {
    console.log( scenarioName );
}

this.logInactivity = function( value ) {
    if ( value === true && this.isIdle === false) {
        this.instrumentationManager.createRequest("logInactivity", [ 'inactive' ] );
    } else if ( value === false && this.isIdle === true ) {
    	this.instrumentationManager.createRequest("logInactivity", [ 'active' ] );
    }
}

this.reportBlocklyChange = function( value ) {
    this.instrumentationManager.broadcastBlockly( '' + value + '', this.activeScenarioPath );
}

//@ sourceURL=source/scene.js