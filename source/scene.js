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

var lastCameraPOV = "thirdPerson";

this.initialize = function() {
    // Set the active camera so we can see the 3D scene
    this.initializeActiveCamera( this.gameCam.camera );
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
            this.cargoPod2.visible = false;
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
            this.cargoPod2.visible = true;
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
    this.activeScenarioPath = "introCinematic";
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
            this.clearWatchList();
            // TODO: pass the scenario, not the name.  Or else just send the 
            //  event without looking the scenario itself up.  Or assert that 
            //  the scenario exists.  Or something.
            this.scenarioChanged( scenario.name );
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
        this.clearWatchList();
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

this.executeBlock = function ( block, action ) {

    var blockName = block[ 0 ];
    var blockID = block[ 1 ];
    var blockNode = block[ 2 ];
    var blockExeTime = block[ 3 ];
    var blockArgs = action[ 2 ];
    var nodeID = action[ 0 ];
    var methodName = action[ 1 ];
    var args = action[ 2 ];
    var node = this.findByID( this, nodeID );

    if ( node ) {
        args = args instanceof Array ? args : [ args ];
        node[ methodName ].apply( node, args );
    }

    this.blockExecuted( blockName, blockID, blockNode, blockExeTime, blockArgs );
}

this.handleDrawingBlocks = function ( blockName, blockID, blockNode, blockExeTime, blockArgs ) {
    var nodeObject = this.findByID( this, blockNode );
    if ( blockName === 'startTriangle' && blockNode !== undefined ) {
        nodeObject.surveyArray = [];
        var scenarioNanites = {
            "extends": "http://vwf.example.com/node3.vwf"
        }
        this.naniteSystems.children.create( "nanites_" + this.activeScenarioPath, scenarioNanites );
    } else if ( blockName === 'endTriangle' && blockNode !== undefined ) {
        var currentPosition = nodeObject.positionSensorValue;
        var currentArray = nodeObject.surveyArray.slice( 0 );
        if ( currentArray[ 0 ][ 0 ] !== currentArray[ currentArray.length - 1 ][ 0 ] 
            || currentArray[ 0 ][ 1 ] !== currentArray[ currentArray.length - 1 ][ 1 ] ) {
          this.blocklyFailedPolygon( 'rover2', currentArray );
        }
        this.blocklyCompletedPolygon( 'rover2', currentArray );
    } else if ( blockName === 'markPoint' && blockNode !== undefined ) {
        var currentPosition = nodeObject.positionSensorValue;
        var currentArray = nodeObject.surveyArray.slice( 0 );
        currentArray.push( currentPosition );
        nodeObject.surveyArray = currentArray;
        this.createNaniteSystem( currentArray.slice(), nodeObject );
    }
    this.blockExecuted( blockName, blockID, blockNode, blockExeTime, blockArgs );
}

this.resetBlocklyBlocks = function( nodeID ) {

    Blockly.mainWorkspace.clear();

    var nodeObject = this.findByID( this, nodeID );
    var defaultXML = nodeObject.startXML;

    if ( defaultXML !== undefined ) {

        //nodeObject[ 'blockly_xml' ] = defaultXML;
        vwf.setProperty( nodeID, 'blockly_xml', defaultXML );
        vwf.setProperty( nodeID, 'new_xml', defaultXML );

        Blockly.mainWorkspace.fireChangeEvent();

        if ( nodeID === this.player.rover.id ) {
            this.player.rover.calcRam();
        } else if ( nodeID === this.player.rover2.id ) {
            this.player.rover2.calcRam();
        } else if ( nodeID === this.player.rover3.id ) {
            this.player.rover3.calcRam();
        }
    }
    
}

this.createNaniteSystem = function( vertices ) {
    var naniteDef, scenarioNanites, index, vertex, callback, lastEdge, rover;
    scenarioNanites = this.naniteSystems[ "nanites_" + this.activeScenarioPath ];
    index = vertices.length - 1;
    vertex = vertices[ index ].slice();
    vertex = this.addAxisOffset( vertex );
    vertex = this.tileMap.getWorldCoordFromTile( vertex[ 0 ], vertex[ 1 ] );
    vertex.push( this.environment.heightmap.getHeight( vertex[ 0 ], vertex[ 1 ] ) );
    // create nanite particles on first 3 points
    if ( index < 3 ) {
        naniteDef = {
            "extends": "source/naniteParticle.vwf",
            "properties": {
                "start": vertex,
                "stop": vertex,
                "listenerID$": undefined
            }
        }
        callback = function( edge ) {
            var rover = this.find( "//rover2" )[ 0 ];
            rover.transformChanged = edge.events.add(
                function( transform ) {
                    edge.stop = [
                        transform[ 12 ],
                        transform[ 13 ],
                        transform[ 14 ]
                    ];
                },
                edge,
                function( id ) {
                    edge.listenerID$ = id;
                }
            );
        };
        scenarioNanites.children.create( "edge_" + index, naniteDef, callback );
    }
    lastEdge = scenarioNanites[ "edge_" + ( index - 1 ) ];
    if ( lastEdge ) {
        rover = this.find( "//rover2" )[ 0 ];
        rover.transformChanged = lastEdge.events.remove( lastEdge.listenerID$ );
    }
}

this.deleteNaniteSystem = function( systemName ) {
    var system = this.naniteSystems[ systemName ];
    if ( system ) {
        this.naniteSystems.children.delete( system );
    } else {
        this.logger.warnx( "Nanite system (" + systemName + ") not found!" );
    }
}

this.displayTiles = function( isVisible ) {
    var material = this.environment.terrain.material;
    var tilesVisible = Boolean( material.tilesVisible );
    if ( isVisible !== tilesVisible ) {
        material.tilesVisible = isVisible ? 1 : 0;
        this.toggledTiles( isVisible );
        // Should we switch to helicam view for the tiles as well?
        // this.switchToHelicamView( isVisible );
    }
}

this.displayGraph = function( isVisible ) {
    var material = this.environment.terrain.material;
    var gridVisible = Boolean( material.gridVisible );
    if ( isVisible !== gridVisible ) {
        material.gridVisible = isVisible ? 1 : 0;
        this.toggledGraph( isVisible );
        this.blocklyGraph.blocklyLine.visible = isVisible;
        this.switchToHelicamView( isVisible );
    }
}

this.switchToHelicamView = function( bSwitch ) {
    var targetNode, camera;
    if ( bSwitch ) {
        camera = this.gameCam;
        targetNode = camera.target;
        if ( targetNode.hasMount( "topDown" ) ) {
            camera.setCameraMount( "topDown" );
        }
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
    this.storedScenario(this.activeScenarioPath);
    this.blockly_activeNodeID = undefined;
    this.blockly_interfaceVisible = false;
    this.applicationState = "menu";
}

this.returnToMenu = function() {
    this.sceneBlackboard = {};
    this.soundManager.stopAllSoundInstances();
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
            this.selectedRover( node.roverRadius );
        } else if ( node === this.graph ) {
            this.gameCam.setCameraMount( "topDown" );
        }
    } else {
        this.logger.errorx( "selectBlocklyNode", "Could not find " +
            "node with ID: " + nodeID );
    }
}

this.setBlocklyContext = function( nodeID ) {
    this.enableBlocklyTabs( [ nodeID ] );
    this.future( 0.25 ).selectBlocklyNode( nodeID );
}

this.clearBlocklyContext = function() {
    this.clearBlocklyTabs();
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

this.addToWatchList = function( node, tile, type ) {
    var wlItem = {
        "name": node.name,
        "id": node.id,
        "tile": tile,
        "type": type
    }
    this.watchList.push( wlItem );
}

this.clearWatchList = function() {
    this.watchList.length = 0;
}

this.checkWatchList = function( tile, type ) {
    var watchList = this.watchList;
    var item;
    for ( var i = 0; i < watchList.length; i++ ) {
        item = watchList[ i ];
        if ( item.tile[ 0 ] === tile[ 0 ] && item.tile[ 1 ] === tile[ 1 ] &&
             ( item.type === type || type === undefined ) ) {
            return true;
        }
    }
    return false;
}

this.getWatchListNodes = function( tile, type ) {
    var watchList = this.watchList;
    var nodes = [];
    var item, node;
    for ( var i = 0; i < watchList.length; i++ ) {
        item = watchList[ i ];
        if ( item.tile[ 0 ] === tile[ 0 ] && item.tile[ 1 ] === tile[ 1 ] &&
             ( item.type === type || type === undefined ) ) {
            node = this.findByID( this, item.id );
            nodes.push( node );
        }
    }
    return nodes;
}

this.addAxisOffset = function( coordinate ) {
    var tilePosition = coordinate.slice();
    var gridAxes = this.environment.terrain.material.gridAxes;
    tilePosition[ 0 ] += gridAxes[ 1 ];
    tilePosition[ 1 ] += gridAxes[ 0 ];
    return tilePosition;
}

this.removeAxisOffset = function( coordinate ) {
    var tilePosition = coordinate.slice();
    var gridAxes = this.environment.terrain.material.gridAxes;
    tilePosition[ 0 ] -= gridAxes[ 1 ];
    tilePosition[ 1 ] -= gridAxes[ 0 ];
    return tilePosition;
}

this.calloutTile = function( coordinate ) {
    var material = this.environment.terrain.material;
    material.bCallout$ = true;
    material.calloutTile = coordinate.slice();
    material.callout();
}

this.removeCalloutTile = function() {
    var material = this.environment.terrain.material;
    material.stopCallout();
}

//@ sourceURL=source/scene.js
