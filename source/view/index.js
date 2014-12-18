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

var appID;
var mainMenu;
var hud;
var blocklyNodes = {};
var graphLines = {};
var loggerNodes = {};
var currentBlocklyNodeID = undefined;
var blocklyExecuting = false;
var lastBlockIDExecuted = undefined;
var currentBlockIDSelected = undefined;
var targetPath = undefined;
var targetID;
var mainRover = undefined;
var blocklyGraphID = undefined;
var alertNodeID = undefined;
var graphIsVisible = false;
var tilesAreVisible = false;
var gridBounds = {
    bottomLeft: undefined,
    topRight: undefined
};
var orbitTarget = new Array( 3 );
var lastRenderTime = 0;
var threejs = findThreejsView();
var activePauseMenu;
var cachedVolume = 1;
var muted = false;
var currentScenario;
var scenarioList;
var startingZoom;

var renderTransition = true;
var playingVideo = false;
// Render modes
var RENDER_NONE = 0;
var RENDER_MENU = 1;
var RENDER_GAME = 2;
var renderMode = RENDER_NONE;

vwf_view.firedEvent = function( nodeID, eventName, eventArgs ) {
    if ( blocklyNodes[ nodeID ] !== undefined ) {
        var blocklyNode = blocklyNodes[ nodeID ];
        switch ( eventName ) {

            case "blocklyVisibleChanged":
                if ( eventArgs[ 0 ] ) {
                    currentBlocklyNodeID = nodeID;
                    updateBlocklyRamBar();
                    updateBlocklyUI( blocklyNode );
                    selectBlock( lastBlockIDExecuted );
                }
                break;

            case "topBlockCountChanged":
                if ( !blocklyExecuting ) {
                    if ( Blockly.mainWorkspace ) {
                        var topBlockCount = Number( eventArgs[ 0 ] );
                        startBlocklyButton.className = topBlockCount == 0 ? "disabled" : "" ;
                        // startBlocklyButton.className = topBlockCount !== 1 ? "disabled" : "" ;
                        // if disabled then need to set the tooltip
                        // There must be only one program for each blockly object
                    }
                }
                break;

            case "blocklyStarted":
                //SJF: Getting the XML to convert to a predefined blockly procedure for 1h
                var xml = Blockly.Xml.workspaceToDom( Blockly.getMainWorkspace() );
                console.log(xml);
                startBlocklyButton.className = "reset";
                var indicator = document.getElementById( "blocklyIndicator" );
                indicator.className = "";
                indicator.style.visibility = "inherit";
                var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
                indicatorCount.className = "";
                indicatorCount.style.visibility = "inherit";
                break;

            case "blocklyStopped":
                startBlocklyButton.className = "";
                var indicator = document.getElementById( "blocklyIndicator" );
                var count = document.getElementById( "blocklyIndicatorCount" );
                indicator.className = "stopped";
                count.className = "stopped";
                
                if( currentScenario != "scenario_dummy" ){
                    clearBlocklyStatus();
                }

            case "blocklyErrored":
                startBlocklyButton.className = "";
                break;

            case "transformChanged":
                if ( nodeID === targetID ) {
                    var targetTransform = eventArgs[ 0 ];
                    if ( targetTransform ) {
                        orbitTarget[ 0 ] = targetTransform[ 12 ];
                        orbitTarget[ 1 ] = targetTransform[ 13 ];
                        orbitTarget[ 2 ] = targetTransform[ 14 ];
                    }
                }
                break;

        }
    } else if ( nodeID === this.kernel.application() ) {
        switch ( eventName ) {
            
            case "blocklyContentChanged":
                if ( currentBlocklyNodeID === blocklyGraphID ) {
                    var currentCode = getBlocklyFunction();
                    this.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "lineFunction", currentCode );
                } else {
                    indicateBlock( lastBlockIDExecuted );
                }
                break;

            case "blockExecuted":
                var blockName = eventArgs[ 0 ];
                var blockID = eventArgs[ 1 ];
                if ( blockID ) {
                    //SJF:Breaking trace functionality
                    if( currentScenario !== "scenario_dummy" ){
                        selectBlock( blockID );
                        indicateBlock( blockID );
                        pushNextBlocklyStatus( blockID );
                    }
                    lastBlockIDExecuted = blockID;
                }
                break;

            case "scenarioChanged":
                currentScenario = eventArgs[ 0 ];
                if ( currentScenario === "mainMenuScenario" ) {
                    setRenderMode( RENDER_MENU );
                } else {
                    setRenderMode( RENDER_GAME );
                }
                lastBlockIDExecuted = undefined;
                gridBounds = eventArgs[ 1 ] || gridBounds;
                enableAllHUDElements();
            case "scenarioReset":
                removePopup();
                removeFailScreen();
                clearBlocklyStatus();
                indicateBlock( lastBlockIDExecuted );
                gridBounds = eventArgs[ 1 ] || gridBounds;
                break;

            case "gotScenarioPaths":
                scenarioList = eventArgs[ 0 ];
                break;

            case "blinkHUD":
                blinkElement( eventArgs[ 0 ] );
                break;

            case "stopBlinkHUD":
                stopElementBlinking( eventArgs[ 0 ] );
                break;

            case "blinkTab":
                blinkTab( eventArgs[ 0 ] );
                break;

            case "stopBlinkTab":
                stopBlinkTab( eventArgs[ 0 ] );
                break;

            case "setHUDElementProperty":
                var element, property, value;
                element = eventArgs[ 0 ];
                property = eventArgs[ 1 ];
                value = eventArgs[ 2 ]
                setHUDElementProperty( element, property, value );
                break;

            case "showCommsImage":
                addImageToCommsDisplay( eventArgs[ 0 ] );
                break;

            case "hideCommsImage":
                removeImageFromCommsDisplay();
                break;

            case "clearBlockly":
                clearBlockly();
                break;

            case "resetRoverSensors":
                resetRoverSensors();
                break;

            case "selectLastBlock":
                if( currentScenario !== "scenario_dummy" ){
                    selectBlock( lastBlockIDExecuted );
                }
                break;

            case "resetHUDState":
                clearHUDEffects();
                break;

            case "clearBlocklyTabs":
                clearBlocklyTabs();
                break;

            case "toggledTiles":
                tilesAreVisible = eventArgs[ 0 ];
                break;

            case "toggledGraph":
                graphIsVisible = eventArgs[ 0 ];
                break;
            
            case "enableBlocklyTab":
                addBlocklyTab( eventArgs[ 0 ], eventArgs[ 1 ] );
                break;

            case "playVideo":
                setRenderMode( RENDER_NONE );
                var src = eventArgs[ 0 ];
                var id = getVideoIdFromSrc( src );
                if ( isNaN( id ) || id < 0 || id >= videos.length ) {
                    id = loadVideo( src );
                }
                $( "#transitionScreen" ).fadeIn( function() {
                    playVideo( id );
                } );
                
                break;

            case "videoPlayed":
                $( "#transitionScreen" ).fadeOut();
                setRenderMode( RENDER_GAME );
                break;

            case "setObjective":
                var objectiveText = eventArgs[ 0 ];
                setNewObjective( objectiveText );
                break;

            case "progressFound":
                var scenario;
                if ( eventArgs[ 0 ] && eventArgs[ 1 ] ) {
                    scenario = eventArgs[ 1 ];
                }
                mainMenu.loggedIn( scenario );
                break;

            case "storedScenario":
                var scenarioName = eventArgs[ 0 ];
                mainMenu.setContinueScenario( scenarioName );
                break;

        } 
    } else if ( loggerNodes[ nodeID ] !== undefined ) { 
        switch ( eventName ) {
            
            case "logAdded":
                var msg = eventArgs[ 0 ];
                var msgType = loggerNodes[ nodeID ].name;
                if ( msgType === "alerts" ) {
                    pushAlert( msg.log );
                }
                break;

            case "logRemoved":
                var index = eventArgs[ 0 ];
                // not sure this is needed, will always remove the first 
                // log in the list
                break;

            case "addSubtitle":
                var msg = eventArgs[ 0 ];
                var time = eventArgs[ 1 ] ? eventArgs[ 1 ] : 1;
                pushSubtitle( msg, time );
                break;            
            
        }
    } else {
        // scenario events
        if ( eventName === "completed" ) {
            advanceScenario();
        }

        if ( eventName === "failed" ) {
            var type = eventArgs[ 0 ];
            var message = eventArgs[ 1 ];
            if ( type ) {
                showFailScreen( type );
            } else if ( message ) {
                displayPopup( "failure", message );
            } else {
                resetScenario();
            }
        }
    }
}

vwf_view.createdNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childName === "rover" ) {
        mainRover = childID;
    }
  
    if ( childName === "graph" ) {
        blocklyGraphID = childID;
    }

    var protos = getPrototypes.call( this, vwf_view.kernel, childExtendsID );

    if ( isBlocklyNode( childImplementsIDs ) ) {
        blocklyNodes[ childID ] = { 
            "ID": childID, 
            "name": childName,
            "ram": 15, 
            "ramMax": 15
        };
    } else if ( isGraphObject( protos ) && childName === "blocklyLine" ) {
        graphLines[ childName ] = { 
            "ID": childID, 
            "name": childName
        } 
    } else if ( isLoggerNode( protos ) ) {
        loggerNodes[ childID ] = {
            "ID": childID, 
            "name": childName,
            "logger_maxLogs": 1,
            "logger_lifeTime": 1000
        }

        if ( childName === "alerts" ) {
            alertNodeID = childID;
        }
    } 
}

vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {
    if ( childID === vwf_view.kernel.application() ) {
        appID = vwf_view.kernel.application();
        setUpView();
        threejs.render = render;
    } else if ( blocklyNodes[ childID ] !== undefined ) {
        var node = blocklyNodes[ childID ];
        node.tab = document.createElement( "div" );
        node.tab.id = childID;
        node.tab.className = "blocklyTab";
        node.tab.onclick = setActiveBlocklyTab;
        node.tab.innerHTML = childName;
    }
}

vwf_view.initializedProperty = function( nodeID, propertyName, propertyValue ) {
    vwf_view.satProperty( nodeID, propertyName, propertyValue );
} 

vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {
    if ( nodeID === mainRover ) {
        switch ( propertyName ) {

            case "battery":
                hud.elements.batteryMeter.battery = parseFloat( propertyValue );
                break;

            case "batteryMax":
                hud.elements.batteryMeter.maxBattery = parseFloat( propertyValue );
                break;

        }
    }

    var blocklyNode = blocklyNodes[ nodeID ];
    if ( blocklyNode ) {
        switch ( propertyName ) {

            case "ram":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                updateBlocklyRamBar();
                break;

            case "ramMax":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID === currentBlocklyNodeID ) {
                    if ( Blockly.mainWorkspace ) {
                        Blockly.mainWorkspace.maxBlocks = Number( propertyValue );    
                    }
                }
                updateBlocklyRamBar();
                break;

            case "blockly_executing":
                var isExecuting = Boolean( propertyValue );
                startBlocklyButton.className = isExecuting ? "reset" : "";
                blocklyExecuting = isExecuting;
                break;

        }
    }

    if ( nodeID === vwf_view.kernel.find( "", "/gameCam" )[ 0 ] ) {
        if ( propertyName === "target" ) {
            targetID = propertyValue.id;
        } else if ( propertyName === "mountName" ) {
            if ( hud ) {
                var selector = hud.elements.cameraSelector;
                var pov = hud.elements[ "camera_" + propertyValue ];
                selector.activeMode.icon = pov.icon;
                selector.activeMode.type = pov.mode;
            }
        }
    }

    if ( nodeID === appID ) {
        if ( propertyName === "blockly_activeNodeID" ) {
            Blockly.SOUNDS_ = {};
            selectBlocklyTab( propertyValue );
        }
    }

    var loggerNode = loggerNodes[ nodeID ];
    if ( loggerNode ) {
        switch ( propertyName ) {

            case "logger_maxLogs":
                loggerNode[ propertyName ] = parseInt( propertyValue );
                break;

            case "logger_lifeTime":
                loggerNode[ propertyName ] = parseFloat( propertyValue );
                break;
        }
    }
}

vwf_view.gotProperty = function( nodeID, propertyName, propertyValue ) {
    if ( nodeID === appID ) {
        if ( propertyName === "version" ) {
            var version = propertyValue;
            var element = document.getElementById( "version" );
            element.innerHTML = "Source available on " +
                "<a target='_blank' href='https://github.com/virtual-world-framework/mars-game'>GitHub</a>. " +
                "Licensed using " + 
                "<a target='_blank' href='../LICENSE.txt'>Apache 2</a>. " + version;
        }
    }
}

function setUpView() {
    vwf_view.kernel.getProperty( appID, "version" );
    mainMenu = new MainMenu();
    hud = new HUD();
    createHUD();
    initializePauseMenu();
    setUpNavigation();
    setUpBlocklyPeripherals();
    setUpStatusDisplay();
    loadScenarioList();
    loadVideo( "intro_cinematic.mp4" );
    loadVideo( "success_cinematic.mp4" );
    loadVideo( "end_cinematic.mp4", undefined, true );
}

function setRenderMode( sceneID ) {
    renderTransition = true;
    renderMode = sceneID;
}

function render( renderer, scene, camera ) {
    var versionElem;
    switch ( renderMode ) {

        case RENDER_NONE:
            if ( renderTransition ) {
                versionElem = document.getElementById( "version" );
                versionElem.style.display = "none";
                renderer.clear();
                loggerBox.style.display = "none";
                hud.visible = false;
                renderTransition = false;
            }
            return;

        case RENDER_MENU:
            if ( renderTransition ) {
                versionElem = document.getElementById( "version" );
                versionElem.style.display = "block";
                loggerBox.style.display = "none";
                mainMenu.setupRenderer( renderer );
                checkPageZoom();
                hud.visible = false;
                renderTransition = false;
            }
            mainMenu.render( renderer );
            break;

        case RENDER_GAME:
            if ( renderTransition ) {
                versionElem = document.getElementById( "version" );
                versionElem.style.display = "none";
                loggerBox.style.display = "block";
                scene.fog = new THREE.FogExp2( 0xC49E70, 0.0035 );
                renderer.setClearColor( scene.fog.color );
                hud.visible = true;
                renderTransition = false;
            }
            blinkTabs();
            renderer.render( scene, camera );
            lastRenderTime = vwf_view.kernel.time();
            break;
    }

    hud.update();
}

function findThreejsView() {
    var lastKernel = vwf_view;
    while ( lastKernel.kernel ) {
        lastKernel = lastKernel.kernel;
    }
    return lastKernel.views[ "vwf/view/threejs" ];
}

function isBlocklyNode( implementsIDs ) {
    var found = false;
    if ( implementsIDs ) {
        for ( var i = 0; i < implementsIDs.length && !found; i++ ) {
            found = ( implementsIDs[i] == "http-vwf-example-com-blockly-controller-vwf" ); 
        }
    }
   return found;
}

function getPrototypes( kernel, extendsID ) {
    var prototypes = [];
    var id = extendsID;
    while ( id !== undefined ) {
        prototypes.push( id );
        id = kernel.prototype( id );
    }
    return prototypes;
}

function isLoggerNode( prototypes ) {
    var foundLogger = false;
    if ( prototypes ) {
        for ( var i = 0; i < prototypes.length && !foundLogger; i++ ) {
            foundLogger = ( prototypes[i] == "http-vwf-example-com-logger-vwf" );    
        }
    }
    return foundLogger;
}

function isGraphObject( prototypes ) {
    var foundObject = false;
    if ( prototypes ) {
        for ( var i = 0; i < prototypes.length && !foundObject; i++ ) {
            foundObject = prototypes[i] === "http-vwf-example-com-graphtool-graphline-vwf" ||
                          prototypes[i] === "http-vwf-example-com-graphtool-graphlinefunction-vwf" ||
                          prototypes[i] === "http-vwf-example-com-graphtool-graphplane-vwf" ||
                          prototypes[i] === "http-vwf-example-com-graphtool-graphgroup-vwf";
        }
    }
    return foundObject;
}

function getBlocklyFunction() {
    var topBlocks = Blockly.mainWorkspace.getTopBlocks( false );
    var yBlock = undefined;
    for ( var j = 0; j < topBlocks.length; j++ ) {
        if ( topBlocks[j].type == 'graph_set_y' ) {
            yBlock = topBlocks[j];
        }
    }
    if ( yBlock === undefined ) {
        return undefined;
    }
    Blockly.JavaScript.init();
    var code = Blockly.JavaScript.blockToCode( yBlock );
    var defs = Blockly.JavaScript.finish( '' );
    if ( code !== ";" ) {
        return "y = " + code;
    } else {
        return undefined;
    }
}

function resetScenario() {
    vwf_view.kernel.callMethod( appID, "resetScenario" );
}

function advanceScenario() {
    vwf_view.kernel.callMethod( appID, "advanceScenario" );
}

function loadScenarioList() {
    vwf_view.kernel.callMethod( appID, "getScenarioPaths" );
}

function runBlockly() {
    vwf_view.kernel.setProperty( currentBlocklyNodeID, "blockly_executing", true );
    populateBlockStack();
}

function setActiveBlocklyTab() {
    if ( currentBlocklyNodeID !== this.id ) {
        vwf_view.kernel.setProperty( appID, "blockly_activeNodeID", this.id );
        if ( blocklyGraphID && blocklyGraphID === this.id ) {
            var cam = vwf_view.kernel.find( "", "//camera" )[ 0 ];
            if ( cam ) {
                vwf_view.kernel.setProperty( cam, "pointOfView", "topDown" );
            }
            hideBlocklyIndicator();
        } else {
            indicateBlock( lastBlockIDExecuted );
        }
    }
}

function selectBlocklyTab( nodeID ) {
    var tabs = document.getElementsByClassName("blocklyTab");
    for ( var i = 0; i < tabs.length; i++ ) {
        tabs[ i ].className = "blocklyTab";
        if ( tabs[ i ].id === nodeID ) {
            tabs[ i ].className += " selected";
        }
    }
    
    var blocklyFooter = document.getElementById( "blocklyFooter" );
    if ( nodeID === blocklyGraphID ) {
        blocklyFooter.style.display = "none";
    } else {
        blocklyFooter.style.display = "block";
    }
}

function updateBlocklyUI( blocklyNode ) {
    if ( Blockly.mainWorkspace ) {
        Blockly.mainWorkspace.maxBlocks = blocklyNode.ramMax;
    }
}

function blinkTabs() {
    var tabs = document.getElementsByClassName( "blocklyTab" );
    for ( var i = 0; i < tabs.length; i++ ) {
        if ( tabs[ i ].isBlinking )
        tabs[ i ].blink();
    }
}

function blinkTab( nodeID ) {
    var tab = document.getElementById( nodeID );
    if ( tab && tab.className.indexOf( "blinking" ) !== -1 ) {
        return;
    }
    if ( tab && tab.className.indexOf( "blocklyTab" ) !== -1 ) {
        tab.blink = blink;
        tab.stopBlink = stopBlink;
        tab.lastBlinkTime = lastRenderTime;
        tab.isBlinking = true;
    }
}

function blink() {
    var blinkInterval = 0.25;
    if ( lastRenderTime > this.lastBlinkTime + blinkInterval ) {
        this.style.opacity = this.style.opacity === "1" ? "0.5" : "1";
        this.lastBlinkTime = lastRenderTime;
    }
}

function stopBlink() {
    this.style.opacity = "1";
    this.isBlinking = false;
}

function stopBlinkTab( nodeID ) {
    var tab = document.getElementById( nodeID );
    if ( tab && tab.isBlinking ) {
        tab.stopBlink();
    }
}

function clearBlockly() {
    if ( Blockly.mainWorkspace ){
        Blockly.mainWorkspace.clear();
    }
    if ( mainRover ){
        vwf_view.kernel.setProperty( mainRover, "blockly_xml", '<xml></xml>' );
    }
    if ( blocklyGraphID ){
        vwf_view.kernel.setProperty( blocklyGraphID, "blockly_xml", '<xml></xml>' );
    }
}

function resetRoverSensors() {
    if ( mainRover ){
        vwf_view.kernel.setProperty( mainRover, "tracksSensorValue", false );
    }
}

function selectBlock( blockID ) {
    var workspace, block, lastBlock;
    workspace = Blockly.getMainWorkspace();
    if ( workspace ) {
        block = workspace.getBlockById( blockID );
        lastBlock = workspace.getBlockById( currentBlockIDSelected );
        if ( lastBlock ) {
            Blockly.removeClass_( lastBlock.svg_.svgGroup_, "blocklySelected" );
        }
        if ( block ) {
            Blockly.addClass_( block.svg_.svgGroup_, "blocklySelected" );
            currentBlockIDSelected = blockID;
        }
    }
}

function indicateBlock( blockID ) {
    var workspace, block;
    workspace = Blockly.getMainWorkspace();
    if ( workspace ) {
        block = workspace.getBlockById( blockID );
    }
    if ( block ) {
        var pos = block.getRelativeToSurfaceXY();
        moveBlocklyIndicator( pos.x, pos.y );
    } else {
        hideBlocklyIndicator();
    }
}

window.onkeypress = function( event ) {
    var pauseScreen;
    if ( event.which === 112 ) {
        pauseScreen = document.getElementById( "pauseScreen" );
        if ( pauseScreen.isOpen ){
            closePauseMenu();
        } else if ( renderMode === RENDER_GAME ) {
            openPauseMenu();
        }
    }
}

function initializePauseMenu() {
    var pauseScreen, buttons, volumeSlider, i;

    pauseScreen = document.getElementById( "pauseScreen" );
    pauseScreen.isOpen = false;

    buttons = document.getElementsByClassName( "pauseMenuButton" );
    for ( i = 0; i < buttons.length; i++ ) {
        buttons[ i ].onmouseover = highlightPauseBtn;
        buttons[ i ].onmouseout = resetPauseBtn;
        buttons[ i ].onmousedown = selectPauseBtn;
        buttons[ i ].onmouseup = highlightPauseBtn;
        switch ( buttons[ i ].id ) {
            case "resume":
                buttons[ i ].onclick = closePauseMenu;
                break;
            case "settings":
                buttons[ i ].onclick = openSettingsMenu;
                break;
            case "back":
                buttons[ i ].onclick = openPauseMenu;
                break;
            case "scenario":
                buttons[ i ].onclick = openScenarioMenu;
                break;
            case "exit":
                buttons[ i ].onclick = exitToMainMenu;
                break;
        }
    }

    buttons = document.getElementsByClassName( "sliderToggle" );
    for ( i = 0; i < buttons.length; i++ ) {
        buttons[ i ].onmouseover = setHover;
        buttons[ i ].onmouseout = resetButtonClasses;
        buttons[ i ].onmousedown = setSelect;
        buttons[ i ].onmouseup = setHover;
        switch ( buttons[ i ].id ) {
            case "mute":
                buttons[ i ].onclick = muteVolume;
                break;
        }
    }

    buttons = document.getElementsByClassName( "inlineButton" );
    for ( i = 0; i < buttons.length; i++ ) {
        buttons[ i ].onmouseover = setHover;
        buttons[ i ].onmouseout = resetButtonClasses;
        buttons[ i ].onmousedown = setSelect;
        buttons[ i ].onmouseup = setHover;
        switch ( buttons[ i ].id ) {
            case "previousScenario":
                buttons[ i ].onclick = displayPreviousScenario;
                break;
            case "nextScenario":
                buttons[ i ].onclick = displayNextScenario;
                break;
            case "scenarioDisplay":
                buttons[ i ].onclick = switchToDisplayedScenario;
                break;
        }
    }

    volumeSlider = document.getElementById( "volumeSlider" );
    volumeSlider.onmousedown = moveVolumeSlider;
    volumeSlider.onmousemove = moveVolumeSlider;
    volumeSlider.onmouseout = moveVolumeSlider;
}

function highlightPauseBtn() {
    this.className = "pauseMenuButton hover";
}

function resetPauseBtn() {
    this.className = "pauseMenuButton";
}

function selectPauseBtn() {
    this.className = "pauseMenuButton select";
}

function setHover() {
    removeClass( this, "select" );
    appendClass( this, "hover" );
}

function setSelect() {
    removeClass( this, "hover" );
    appendClass( this, "select" );
}

function resetButtonClasses() {
    removeClass( this, "select" );
    removeClass( this, "hover" );
}

function closePauseMenu() {
    var pauseScreen = document.getElementById( "pauseScreen" );
    pauseScreen.isOpen = false;
    pauseScreen.style.display = "none";
}

function openPauseMenu() {
    var pauseScreen = document.getElementById( "pauseScreen" );
    pauseScreen.isOpen = true;
    pauseScreen.style.display = "block";
    setActivePauseMenu( "pauseMenu" );
}

function openSettingsMenu() {
    setActivePauseMenu( "settingsMenu" );
    setVolumeSliderPosition( cachedVolume );
}

function openScenarioMenu() {
    setActivePauseMenu( "scenarioMenu" );
    loadScenarioData();
}

function exitToMainMenu() {
    var sceneID = appID;
    resetSubtitles();
    clearBlockly();
    currentBlocklyNodeID = undefined;
    vwf_view.kernel.setProperty( sceneID, "blockly_activeNodeID", undefined );
    vwf_view.kernel.callMethod( sceneID, "restartGame" );
    closePauseMenu();
}

function loadScenarioData() {
    var display = document.getElementById( "scenarioDisplay" );
    display.innerHTML = currentScenario;
}

function displayPreviousScenario() {
    var display = document.getElementById( "scenarioDisplay" );
    var displayedScenario = display.innerHTML;
    var displayedIndex = scenarioList.indexOf( displayedScenario );
    if ( displayedIndex > 0 ) {
        display.innerHTML = scenarioList[ displayedIndex - 1 ];
    }
}

function displayNextScenario() {
    var display = document.getElementById( "scenarioDisplay" );
    var displayedScenario = display.innerHTML;
    var displayedIndex = scenarioList.indexOf( displayedScenario );
    if ( displayedIndex < scenarioList.length - 1 ) {
        display.innerHTML = scenarioList[ displayedIndex + 1 ];
    }
}

function switchToDisplayedScenario() {
    var sceneID = appID;
    var display = document.getElementById( "scenarioDisplay" );
    var displayedScenario = display.innerHTML;
    currentBlocklyNodeID = undefined;
    clearBlockly();
    vwf_view.kernel.setProperty( sceneID, "blockly_activeNodeID", undefined );
    vwf_view.kernel.setProperty( sceneID, "activeScenarioPath", displayedScenario );
    closePauseMenu();
}

function setActivePauseMenu( menuID ) {
    if ( !activePauseMenu || menuID !== activePauseMenu.id ) {
        activePauseMenu && ( activePauseMenu.style.display = "none" );
        activePauseMenu = document.getElementById( menuID );
        if ( activePauseMenu ) {
            activePauseMenu.style.display = "block";
        } else {
            closePauseMenu();
        }
    }
}

function addBlocklyTab( nodeID ) {
    var node = blocklyNodes[ nodeID ];
    if ( node ) {
        var blocklyHeader = document.getElementById( "blocklyWrapper-top" );
        if ( node.tab.parentNode && node.tab.parentNode === blocklyHeader ) {
            return;
        }
        blocklyHeader.appendChild( node.tab );
    }
}

function removeBlocklyTab( nodeID ) {
    var node = blocklyNodes[ nodeID ];
    if ( node ) {
        var blocklyHeader = document.getElementById( "blocklyWrapper-top" );
        if ( !node.tab.parentNode || node.tab.parentNode !== blocklyHeader ) {
            return;
        }
        blocklyHeader.removeChild( node.tab );
    }
}

function clearBlocklyTabs() {
    var blocklyHeader = document.getElementById( "blocklyWrapper-top" );
    var blocklyTabs = blocklyHeader.getElementsByClassName( "blocklyTab" );
    while ( blocklyTabs.length > 0 ) {
        blocklyHeader.removeChild( blocklyTabs[ 0 ] );
    }
}

function setVolume( value ) {
    var sm, muteButton;
    sm = vwf_view.kernel.find( appID, "/soundManager" )[ 0 ];
    if ( sm ) {
        value = Math.min( 1, Math.max( 0, value ) );
        muteButton = document.getElementById( "mute" );
        if ( value === 0 ) {
            appendClass( muteButton, "muted" );
            muted = true;
        } else {
            removeClass( muteButton, "muted" );
            muted = false;
            cachedVolume = value;
        }
        setVolumeSliderPosition( value );
        vwf_view.kernel.callMethod( sm, "setMasterVolume", [ value ] );
    }
}

function moveVolumeSlider( event ) {
    var pct, handle, deadzone;
    if ( event.which === 1 ) {
        handle = document.getElementById( "volumeHandle" );
        deadzone = handle.clientWidth / 2;
        pct = ( event.offsetX - deadzone ) / ( this.clientWidth - deadzone * 2 );
        setVolume( pct );
    }
}

function muteVolume() {
    if ( muted ) {
        setVolume( cachedVolume );
    } else {
        setVolume( 0 );
    }
}

function setVolumeSliderPosition( volume ) {
    var volumeHandle = document.getElementById( "volumeHandle" );
    var deadzone = volumeHandle.clientWidth / 2;
    var pos = volume * ( volumeHandle.parentNode.clientWidth - deadzone * 2 );
    var readout, readoutPct;
    volumeHandle.style.marginLeft = pos + "px";
    readout = document.getElementById( "volumeReadout" );
    readoutPct = volume * 100;
    readoutPct = Math.round( readoutPct );
    readout.innerHTML = "Volume: " + readoutPct + "%";
}

function checkPageZoom() {
    var zoom, alertDiv, alertStr;
    // SVG detects the zoom level of the page. Blockly uses SVG, so we
    //  can use it to detect the page zoom for us.
    if ( Blockly && Blockly.svg ) {
        zoom = Math.round( Blockly.svg.currentScale * 100 );
        if ( startingZoom === undefined ) {
            startingZoom = zoom;
        }
        alertDiv = document.getElementById( "zoomAlert" );
        if ( zoom !== 100 ) {
            alertStr = "Your browser zoom is at " + zoom + "%. Press Ctrl and";
            alertStr += ( zoom > 100 ) ? " - " : " + ";
            alertStr += "on your keyboard at the same time to change the zoom. ";
            alertStr += "Please set the zoom to 100%"
            alertStr += ( startingZoom === 100 ) ? "." : " and reload the page.";
            alertDiv.style.display = "block";
            alertDiv.style.fontSize = Math.round( 100 / zoom * 100 ) + "%";
            alertDiv.style.width = Math.round( 100 / zoom * 300 ) + "px";
        } else if ( startingZoom !== 100 ) {
            alertStr = "Zoom set to 100%. Please reload the page.";
            alertDiv.style.display = "block";
        } else {
            alertStr = "";
            alertDiv.style.display = "none";
        }
        alertDiv.innerHTML = alertStr;
    }
}

window.addEventListener( "resize", checkPageZoom );

//@ sourceURL=source/index.js
