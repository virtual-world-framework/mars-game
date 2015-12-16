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
    this.mediaManager.videoManager.url = [ "assets/video/Intro_800x600.webm", "assets/video/Intro_800x600.mp4" ];
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
    this.startedGame();
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

    if ( methodName === 'moveRadialAbsolute' ) {
        //console.log('pushing new points');
        //var currentArray = node.surveyArray.slice( 0 );
        //currentArray.push( args );
        //node.surveyArray = currentArray;
    }

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
        // this.naniteSystems.children.create( "nanites_" + this.activeScenarioPath, scenarioNanites );
    } else if ( blockName === 'endTriangle' && blockNode !== undefined ) {
        var currentArray = nodeObject.surveyArray.slice( 0 );
        if ( currentArray[ 0 ][ 0 ] !== currentArray[ currentArray.length - 1 ][ 0 ] 
            || currentArray[ 0 ][ 1 ] !== currentArray[ currentArray.length - 1 ][ 1 ] ) {
          this.blocklyFailedPolygon( 'rover2', currentArray );
        }
        this.blocklyCompletedPolygon( 'rover2', currentArray );
        nodeObject.allSurveys.push( currentArray );
    } else if ( blockName === 'markPoint' && blockNode !== undefined ) {
        //var currentPosition = nodeObject.positionSensorValue;
        var currentArray = nodeObject.surveyArray.slice( 0 );
        currentArray.push( blockArgs );
        nodeObject.surveyArray = currentArray;
        //currentArray.push( currentPosition );
        //nodeObject.surveyArray = currentArray;
        // this.createNaniteSystem( currentArray.slice(), nodeObject );
    } else {
        var currentArray = nodeObject.allSurveys.slice( 0 );
        this.blocklyCompletedSurvey( 'rover2', currentArray );
        nodeObject.allSurveys = [];
        nodeObject.surveyArray = [];
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

        var xml = Blockly.Xml.textToDom( defaultXML );
        
        var blocks = xml.getElementsByTagName( "block" );
        var count = 0;

        if ( blocks ) {
            count = blocks.length;
        }

        if ( nodeID === this.player.rover.id ) {
            this.player.rover.ram = this.player.rover.ramMax - count;
        } else if ( nodeID === this.player.rover2.id ) {
            this.player.rover2.ram = this.player.rover2.ramMax - count;
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
        this.environment.environmentObjects.platform.material.tilesVisible = material.tilesVisible;
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

this.setActiveRoverPose = function( pose ) {
    var rover = this.findByID( this, this.blockly_activeNodeID );
    if ( rover && rover.thirdPerson ) {
        rover.thirdPerson.cameraPose = pose;
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

this.cameraMounted = function( mountName ) {
    var activeNode;
    activeNode = this.findByID( this, this.blockly_activeNodeID );
    if ( activeNode && activeNode.facingArrow ) {
        if ( mountName === "topDown" ) {
            activeNode.facingArrow.visible = true;
        } else {
            activeNode.facingArrow.visible = false;
        }
    }
}

this.targetSwitched = function( oldTarget, newTarget ) {
    if ( oldTarget && oldTarget.facingArrow ) {
        oldTarget.facingArrow.visible = false;
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

this.attemptLogin = function( userID, password ) {
    this.instrumentationManager.getRequest( "getPlayerState", [ userID, password ] );
}

this.loginFailed = function( responseText ) {
    alert("Login Failed - Incorrect Username/Password");
    var loader = document.getElementById( "loginLoader" );
    loader.style.display = "none";
}

this.loginSucceeded = function( userID, scenarioName ) {
    if ( scenarioName !== undefined ) {
        //alert("Retrieved Scenario:" + scenarioName);
    }
    var loader = document.getElementById( "loginLoader" );
    loader.style.display = "none";
    this.playerId = userID;
    if ( scenarioName === undefined ) {
        this.newGame();
    } else {
        this.applicationState = 'playing';
        this.loadGame( scenarioName );
    }
    
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

this.setBlocklyContext = function( nodeNames ) {
    var i, nodeIDs, node;
    nodeIDs = [];
    for ( i = 0; i < nodeNames.length; i++ ) {
        node = this.find( "//" + nodeNames[ i ] )[ 0 ];
        nodeIDs.push( node.id );
    }
    this.enableBlocklyTabs( nodeIDs );
    this.future( 0.25 ).selectBlocklyNode( nodeIDs[ 0 ] );
}

this.clearBlocklyContext = function() {
    this.clearBlocklyTabs();
}

this.setUserTriangles = function( vertices ) {
    var tempColors = [
        [ 0.7, 0.3, 0.3 ],
        [ 0.3, 0.7, 0.3 ],
        [ 0.3, 0.3, 0.7 ],
        [ 0.6, 0.6, 0.2 ]
    ];
    var verts, tris, coords;
    verts = vertices.length;
    tris = verts / 3;
    for ( var i = 0; i < verts; i++ ) {
        var valid = !isNaN( vertices[ i ][ 0 ] ) || !isNaN( vertices[ i ][ 1 ] );
        if ( !valid ) {
            return;
        }
        coords = this.addAxisOffset( vertices[ i ] );
        vertices[ i ] = this.tileMap.getWorldCoordFromTile( coords[ 0 ], coords[ 1 ] );
    }
    var material = this.environment.terrain.material;
    material.userTris = vertices;
    material.userTriColors = tempColors.slice( 0, tris );
}

this.drawSchematicTriangle = function( pointA, pointB, pointC ) {
    // pointA, pointB, and pointC are in the format: [ x, y ]
    // x and y are in world space ( not grid coordinate space )
    var material = this.environment.terrain.material;
    var triArray = material.triangle.slice();
    if ( triArray.length >= 12 ) {
        triArray = triArray.slice( 3 );
    }
    triArray.push( pointA, pointB, pointC );
    material.triangle = triArray;
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
    this.gridAxesChanged();
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
    this.environment.terrain.material.calloutTile = coordinate.slice();
    this.environment.environmentObjects.platform.material.calloutTile = coordinate.slice();
    this.bCallout$ = true;
    if ( !this.calloutScheduled$ ) {
        this.callout();
    }
}

this.removeCalloutTile = function() {
    this.stopCallout();
}

this.callout = function() {
    var highlight = this.calloutHighlight;
    if ( this.bCallout$ ) {
        this.calloutHighlight = highlight === 0 ? 1 : 0;
        this.environment.terrain.material.calloutHighlight = this.calloutHighlight;
        this.environment.environmentObjects.platform.material.calloutHighlight = this.calloutHighlight;
        this.calloutScheduled$ = true;
        this.future( 0.25 ).callout();
    } else {
        this.calloutScheduled$ = false;
    }
}

this.stopCallout = function() {
    this.bCallout$ = false;
    this.calloutHighlight = 0;
    this.environment.terrain.material.calloutHighlight = this.calloutHighlight;
    this.environment.environmentObjects.platform.material.calloutHighlight = this.calloutHighlight;
}

// This method is being handled by the view
this.playVideo = function( src ) {}

this.printCameraPose = function() {
    var pose = this.gameCam.getPoseFromTransform();
    console.log( "Camera pose: [ " + pose[ 0 ] + ", " + pose[ 1 ] + ", " + pose[ 2 ] + " ]" );
}

//@ sourceURL=source/scene.js
