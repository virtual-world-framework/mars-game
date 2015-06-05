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

var lastCameraPOV = "thirdPerson";

this.initialize = function() {
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.gameCam.camera );
    this.setUpRoverListeners();
    this.future( 3 ).applicationLoaded();
}

this.applicationLoaded = function() {
    this.applicationState = "menu";
    // NXM: Preload the intro cinematic.
    this.mediaManager.videoManager.url = [ "assets/video/intro_cinematic.webm", "assets/video/intro_cinematic.mp4" ];
}

this.setApplicationState = function( state ) {
    switch ( state ) {
        case "loading":
            break;
        case "menu":
            this.mainMenu.visible = true;
            this.mainMenu.future( 0 ).setup();
            // TODO: Consolidate game nodes
            this.environment.visible = false;
            this.player.visible = false;
            this.airDust.visible = false;
            this.smoke1.visible = false;
            this.smoke2.visible = false;
            this.smoke3.visible = false;
            this.sunLight.visible = false;
            this.envLight.visible = false;
            this.pickups.visible = false;
            this.hud.visible = false;
            this.triggerGroupManager.checkingGroups = false;
            break;
        case "playing":
            this.mainMenu.visible = false;
            this.soundManager.stopSoundGroup( "music" );
            this.selectBlocklyNode( this.player.rover.id );
            this.hud.setAllEnabled( true );
            // TODO: Consolidate game nodes
            this.environment.visible = true;
            this.player.visible = true;
            this.airDust.visible = true;
            this.smoke1.visible = true;
            this.smoke2.visible = true;
            this.smoke3.visible = true;
            this.sunLight.visible = true;
            this.envLight.visible = true;
            this.pickups.visible = true;
            this.hud.visible = true;
            this.triggerGroupManager.checkingGroups = true;
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
    this.activeScenarioPath = "mission3task1";
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
            // TODO: pass the scenario, not the name.  Or else just send the 
            //  event without looking the scenario itself up.  Or assert that 
            //  the scenario exists.  Or something.
            this.scenarioChanged( scenario.name, gridBounds );
            if ( scenario.brief ) {
                this.loadedMissionBrief(
                    scenario.brief.title,
                    scenario.brief.content,
                    scenario.brief.backgroundImage
                );
            }
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
    this.hud.setAllEnabled( true );
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
    var scenarios = this.find( "*[@scenarioName]" );
    return scenarios;
}

// TODO: can we eliminate this?
this.getCurrentScenario = function() {
    // TODO: make this handle more than one scenario
    return this.find( this.activeScenarioPath )[ 0 ];
}

this.resetHUDState = function() {
    this.hud.setAllBlinking( false );
    this.hud.setAllEnabled( true );
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
        var currentStrings = this.subtitles.strings;
        currentStrings.push( log );
        this.subtitles.strings = currentStrings;
    }
}

function calcGridBounds( grid ) {
    grid.getWorldFromGrid( grid.minX, grid.minY, gridBounds.bottomLeft );
    grid.getWorldFromGrid( grid.maxX, grid.maxY, gridBounds.topRight );
}

this.executeBlock = function ( block, action ) {

    var blockName = block[ 0 ];
    var blockID = block[ 1 ];
    var blockNode = block[ 2 ];
    var blockExeTime = block[ 3 ];    
    var blockArgs = action[ 2 ];

    this.blockExecuted( blockName, blockID, blockNode, blockExeTime, blockArgs );

    var nodeID = action[ 0 ];
    var methodName = action[ 1 ];
    var args = action[ 2 ];
    var node = this.findByID( this, nodeID );

    if ( node ) {
        args = args instanceof Array ? args : [ args ];
        node[ methodName ].apply( node, args );
    }
}

this.setUpRoverListeners = function() {
    this.scenarioChanged = this.events.add( function( scenarioName ) {
        this.player.rover.findAndSetCurrentGrid( scenarioName );
        this.player.rover2.findAndSetCurrentGrid( scenarioName );
        this.player.rover3.findAndSetCurrentGrid( scenarioName );
    }, this );
}

this.displayTiles = function( isVisible ) {
    var material = this.environment.terrain.material;
    var tilesVisible = Boolean( material.tilesVisible );
    if ( isVisible !== tilesVisible ) {
        material.tilesVisible = isVisible ? 1 : 0;
        this.toggledTiles( isVisible );
    }
}

this.displayGraph = function( isVisible ) {
    var material = this.environment.terrain.material;
    var gridVisible = Boolean( material.gridVisible );
    if ( isVisible !== gridVisible ) {
        material.gridVisible = isVisible ? 1 : 0;
        this.toggledGraph( isVisible );
        this.blocklyGraph.blocklyLine.visible = isVisible;
    }
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
    this.blockly_activeNodeID = undefined;
    this.blockly_interfaceVisible = false;
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

this.blinkTab = function( nodeName ) {
    switch ( nodeName ) {
        case "rover":
            this.roverTabBlinking = true;
            break;
        case "graph":
            this.graphTabBlinking = true;
            break;
        default:
            this.logger.warnx( "blinkTab", "Node " + nodeName + " not handled." );
            break;
    }
}

this.stopBlinkTab = function( nodeName ) {
    switch ( nodeName ) {
        case "rover":
            this.roverTabBlinking = false;
            break;
        case "graph":
            this.graphTabBlinking = false;
            break;
        default:
            this.logger.warnx( "stopBlinkTab", "Node " + nodeName + " not handled." );
            break;
    }
}

this.playVideo = function( src ) {
    // var id = getVideoIdFromSrc( src );
    // if ( isNaN( id ) || id < 0 || id >= videos.length ) {
    //     id = loadVideo( src );
    // }
    $( "#transitionScreen" ).fadeIn( function(){ 
        playVideo( src );
    });
}

this.pauseGame = function() {
    this.paused();
}

this.unpauseGame = function() {
    this.unpaused();
}

this.selectBlocklyNode = function( nodeID ) {
    var node = this.findByID( this, nodeID );
    var mountName;
    if ( node ) {
        if ( this.blockly_activeNodeID !== nodeID ) {
            this.blockly_activeNodeID = nodeID;
        }
        if ( node.defaultMount && this.gameCam.target !== node ) {
            if ( node.hasMount( this.gameCam.mount.name ) ) {
                mountName = this.gameCam.mount.name;
            }
            this.gameCam.setCameraTarget( node, mountName );
            this.hud.selectRover( nodeID );
        } else if ( node === this.graph ) {
            this.gameCam.setCameraMount( "topDown" );
        }
    } else {
        this.logger.errorx( "selectBlocklyNode", "Could not find " +
            "node with ID: " + nodeID );
    }
}

this.enableBlocklyNodes = function( nodes ) {
    this.enableBlocklyTabs( nodes );
    this.hud.roverSelector.showRoverIcons( true, nodes )
}

this.disableBlocklyNodes = function( nodes ) {
    this.clearBlocklyTabs( nodes );
    this.hud.roverSelector.showRoverIcons( false, nodes );
}

this.drawSchematicTriangle = function( pointA, pointB, pointC ) {
    // pointA, pointB, and pointC are in the format: [ x, y ]
    // x and y are in world space ( not grid coordinate space )
    var material = this.environment.terrain.material;
    material.triangle = [ pointA, pointB, pointC ];
}

this.hideSchematicTriangle = function() {
    var material = this.environment.terrain.material;
    material.triangle = [];
}

this.openMissionBrief = function() {
    this.missionBriefOpened();
}

this.setGridAxes = function( x, y ) {
    var material = this.environment.terrain.material;
    material.gridAxes = [ x, y ];
}

//@ sourceURL=source/scene.js
