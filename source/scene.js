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
    this.initializeActiveCamera( this.gameCam.camera );
    this.setUpCameraListener();
    this.setUpRoverListeners();
    this.future( 3 ).applicationLoaded();
}

this.applicationLoaded = function() {
    this.applicationState = "menu";
}

this.setApplicationState = function( state ) {
    switch ( state ) {
        case "loading":
            break;
        case "menu":
            this.mainMenu.visible = true;
            this.mainMenu.future( 0 ).animate();
            // TODO: Consolidate game nodes
            this.environment.visible = false;
            this.player.visible = false;
            this.airDust.visible = false;
            this.smoke1.visible = false;
            this.smoke2.visible = false;
            this.smoke3.visible = false;
            this.backdrop.visible = false;
            this.sunLight.visible = false;
            this.envLight.visible = false;
            this.pickups.visible = false;
            break;
        case "playing":
            this.mainMenu.visible = false;
            this.soundManager.stopSoundGroup( "music" );
            this.gameCam.setCameraTarget( this.player.rover );
            // TODO: Consolidate game nodes
            this.environment.visible = true;
            this.player.visible = true;
            this.airDust.visible = true;
            this.smoke1.visible = true;
            this.smoke2.visible = true;
            this.smoke3.visible = true;
            this.backdrop.visible = true;
            this.sunLight.visible = true;
            this.envLight.visible = true;
            this.pickups.visible = true;
            break;
        default:
            this.logger.errorx( "setApplicationState", "Invalid application "
                + "state: \'" + state + "\'" );
            return;
    }
    this.applicationState = state;
}

this.newGame = function() {
    this.applicationState = "playing";
    this.activeScenarioPath = "introScreenScenario";
}

this.continueGame = function( scenario ) {
    this.applicationState = "playing";
    this.activeScenarioPath = scenario;
}

this.setScenario = function( path ) {
    if ( path ) {
        var scenario = this.find( path )[ 0 ];
        if ( scenario ) {
            this.activeScenarioPath = path;
            // TODO: remove knowledge of inner workings of the scenario; let 
            //  the scenario itself handle bookkeeping in its event handlers.
             if ( scenario.grid && scenario.grid.clearGrid ) {
                 scenario.grid.clearGrid();
             }
            calcGridBounds( scenario.grid );
            this.createGridDisplay( scenario.grid );
            // TODO: pass the scenario, not the name.  Or else just send the 
            //  event without looking the scenario itself up.  Or assert that 
            //  the scenario exists.  Or something.
            this.scenarioChanged( scenario.name, gridBounds );
            scenario.future( 0 ).startScenario();
        } else {
            this.logger.warnx( "setScenario", "Scenario for path '" + path + 
                               "' not found." );
        }
    }
}

this.resetScenario = function() {
    var scenario = this.getCurrentScenario();
    if ( scenario ) {
        // TODO: remove knowledge of inner workings of the scenario; let the
        //  scenario itself handle bookkeeping in its event handlers.
        if ( scenario.grid && scenario.grid.clearGrid ) {
            scenario.grid.clearGrid();
        }      
        // TODO: pass the scenario, not the name.  Or else just send the event
        //  without looking the scenario itself up.  Or assert that the scenario
        //  exists.  Or something.
        this.scenarioReset( scenario.name );
        scenario.future( 0 ).startScenario();
    } else {
        this.logger.warnx( "resetScenario", "Invalid scenario path: " + this.activeScenarioPath );
    }
}

this.advanceScenario = function() {
    // TODO: handle this in the scenario.  Let it depend on us rather than vice
    //  versa (we shouldn't have to know the inner workings of the scenario)
    var scenario = this.getCurrentScenario();
    calcGridBounds( scenario.grid );
    if ( scenario.nextScenarioPath ) {
        this.activeScenarioPath = scenario.nextScenarioPath;
    } else {
        this.logger.warnx( "advanceScenario", "nextScenarioPath not found." );
    }
}

// TODO: can we eliminate this?
this.getScenarioPaths = function() {
    var scenarios = this.getScenarios();
    var paths = new Array();
    for ( var i = 0; i < scenarios.length; i++ ) {
        paths.push( scenarios[ i ].name );
    }
    this.gotScenarioPaths( paths );
}

// TODO: can we eliminate this?
this.getScenarios = function() {
    var scenarios = this.find( ".//element(*,'source/scenario/scenario.vwf')" );
    return scenarios;
}

// TODO: can we eliminate this?
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
    this.gameCam.mounted = function( mount ) {
        if ( mount.name !== "topDown") {
            scene.displayTiles( false );
            scene.displayGraph( false );
        }
    }
}

this.setUpRoverListeners = function() {
    this.scenarioChanged = ( function( scenarioName ) {
        this.player.rover.findAndSetCurrentGrid( scenarioName );
        //this.player.rover.findAndSetCurrentGrid( this.activeScenarioPath );
    } ).bind( this );
     //rover.findAndSetCurrentGrid( this.activeScenarioPath );
}

this.displayTiles = function( isVisible ) {
    this.gridTileGraph.mapTiles.groupVisible = isVisible;
    if ( isVisible && this.gameCam.mountName !== "topDown" ) {
        this.gameCam.setCameraMount( "topDown" );
    }
    this.toggledTiles( isVisible );
}

this.displayGraph = function( isVisible ) {
    this.blocklyGraph.setGraphVisibility( isVisible );
    if ( isVisible && this.gameCam.mountName !== "topDown" ) {
        this.gameCam.setCameraMount( "topDown" );
    }
    this.toggledGraph( isVisible );
    this.blocklyGraph.blocklyLine.visible = isVisible;
}

this.setCinematicView = function( pose ) {
    if ( pose ) {
        this.gameCam.setCameraMount( "thirdPerson" );
        this.gameCam.setCameraPose( pose );
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
    this.storedScenario( this.activeScenarioPath );
    this.applicationState = "menu";
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

this.loadGame = function( scenarioName ) {
    this.activeScenarioPath = scenarioName;
    this.future( 0 ).loadedGame();
}

//@ sourceURL=source/scene.js