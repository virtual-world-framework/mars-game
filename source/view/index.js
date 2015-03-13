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
var blocklyNodes = {};
var graphLines = {};
var loggerNodes = {};
var currentBlocklyNodeID = undefined;
var currentProcedureBlockID = undefined;
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
                    indicateProcedureBlock( currentProcedureBlockID );
                }
                break;

            case "topBlockCountChanged":
                if ( !blocklyNode.blocklyExecuting ) {
                    if ( Blockly.mainWorkspace ) {
                        var topBlockCount = Number( eventArgs[ 0 ] );
                        
                        // SJF: We must allow multiple top blocks to allow procedures
                         startBlocklyButton.className = topBlockCount === 0 ? "disabled" : "" ;
                        // startBlocklyButton.className = topBlockCount !== 1 ? "disabled" : "" ;
                        // if disabled then need to set the tooltip
                        // There must be only one program for each blockly object
                    }
                }
                break;

            case "blocklyStarted":
                var indicator = document.getElementById( "blocklyIndicator" );
                indicator.className = "";
                indicator.style.visibility = "inherit";
                var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
                indicatorCount.className = "";
                indicatorCount.style.visibility = "inherit";
                var procedureIndicator = document.getElementById( "blocklyProcedureIndicator" );
                procedureIndicator.className = "";
                procedureIndicator.style.visibility = "inherit";
                currentProcedureBlockID = undefined;
                break;

            case "blocklyStopped":
                startBlocklyButton.className = "";
                var indicator = document.getElementById( "blocklyIndicator" );
                var count = document.getElementById( "blocklyIndicatorCount" );
                indicator.className = "stopped";
                count.className = "stopped";
                var procedureIndicator = document.getElementById( "blocklyProcedureIndicator" );
                procedureIndicator.className = "stopped";

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
    } else if ( nodeID === vwf_view.kernel.application() ) {
        switch ( eventName ) {

            case "paused":
                openPauseMenu();
                break;
            case "unpaused":
                break;
            
            case "blocklyContentChanged":
                if ( currentBlocklyNodeID === blocklyGraphID ) {
                    var currentCode = getBlocklyFunction();
                    vwf_view.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "lineFunction", currentCode );
                } else {
                    indicateBlock( lastBlockIDExecuted );
                    indicateProcedureBlock( currentProcedureBlockID );
                }
                break;

            case "blockExecuted":
                var blockName = eventArgs[ 0 ];
                var blockID = eventArgs[ 1 ];

                if ( blockID ) {
                    selectBlock( blockID );
                    indicateBlock( blockID );
                    lastBlockIDExecuted = blockID;
                }
                break;

            case "scenarioChanged":
                currentScenario = eventArgs[ 0 ];
                lastBlockIDExecuted = undefined;
                currentProcedureBlockID = undefined;
                gridBounds = eventArgs[ 1 ] || gridBounds;
            case "scenarioReset":
                removePopup();
                removeFailScreen();
                indicateBlock( lastBlockIDExecuted );
                indicateProcedureBlock( currentProcedureBlockID );
                gridBounds = eventArgs[ 1 ] || gridBounds;
                break;

            case "gotScenarioPaths":
                scenarioList = eventArgs[ 0 ];
                break;

            case "clearBlockly":
                clearBlockly();
                break;

            case "resetRoverSensors":
                resetRoverSensors();
                break;

            case "selectLastBlock":
                selectBlock( lastBlockIDExecuted );
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
                addBlocklyTab( eventArgs[ 0 ] );
                break;

            case "videoPlayed":
                $( "#transitionScreen" ).fadeOut( function() {
                    removeVideo();
                } );
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

        if( eventName === "videoEnded" ){
            removeVideoOnEvent();
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
            "ramMax": 15,
            "blocklyExecuting": false
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
        node.tab.vwfNodeName = childName;
        node.tab.innerHTML = childName;
    }
}

vwf_view.initializedProperty = function( nodeID, propertyName, propertyValue ) {
    vwf_view.satProperty( nodeID, propertyName, propertyValue );
} 

vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {
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
                blocklyNode.blocklyExecuting = isExecuting;
                if( isExecuting ) {
                    startBlocklyButton.className = "reset";
                } else {
                    startBlocklyButton.className = "";
                }
                break;

        }
    }

    if ( nodeID === vwf_view.kernel.find( "", "/gameCam" )[ 0 ] ) {
        if ( propertyName === "target" ) {
            targetID = propertyValue.id;
        }
    }

    if ( nodeID === appID ) {
        if ( propertyName === "blockly_activeNodeID" ) {
            Blockly.SOUNDS_ = {};
            selectBlocklyTab( propertyValue );
        } else if ( propertyName === "applicationState" ) {
            var state = propertyValue;
            var versionElem = document.getElementById( "version" );
            switch ( state ) {
                case "loading":
                    $( "#transitionScreen" ).fadeIn( 0 );
                    break;
                case "menu":
                    loggerBox.style.display = "none";
                    mainMenu.setVisible( true );
                    versionElem.style.display = "block";
                    checkPageZoom();
                    $( "#transitionScreen" ).fadeOut();
                    break;
                case "playing":
                    mainMenu.setVisible( false );
                    versionElem.style.display = "none";
                    loggerBox.style.display = "block";
                    $( "#transitionScreen" ).fadeOut();
                    break;
            }
        } else if ( propertyName === "roverTabBlinking" ) {
            if ( propertyValue === true ) {
                blinkTab( getBlocklyNodeIDByName( "rover" ) );
            } else {
                stopBlinkTab( getBlocklyNodeIDByName( "rover" ) );
            }
        } else if ( propertyName === "graphTabBlinking" ) {
            if ( propertyValue === true ) {
                blinkTab( getBlocklyNodeIDByName( "graph" ) );
            } else {
                stopBlinkTab( getBlocklyNodeIDByName( "graph" ) );
            }
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

            case "strings":
                var strings = propertyValue;
                var lb = document.getElementById( "loggerBox" );
                if ( strings.length !== lb.counter ) {
                    var arrayLength = strings.length;
                    for (var i = 0; i < arrayLength; i++) {
                        pushSubtitle( strings[ i ] );
                    }
                } else {
                    pushSubtitle( strings[ strings.length - 1 ] );
                }
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
                "<a target='_blank' href='../LICENSE.txt'>Apache 2</a>. " +
                "Version: " + version;
        } 
    }
}

function setUpView() {
    vwf_view.kernel.getProperty( appID, "version" );
    mainMenu = new MainMenu();
    initializePauseMenu();
    setUpNavigation();
    setUpBlocklyPeripherals();
    setUpStatusDisplay();
    loadScenarioList();
}

function render( renderer, scene, camera ) {

    blinkTabs();

    //renderer.render( scene, camera );

    //HACK: Eliminate frustum culling to hide faulty webGL glDrawElements overflow errors.
    // Frustum culling causes some buffer regeneration to be deferred until later, 
    // while meshes are still trying to be rendered before their buffers regen 

    scene.traverse(function(o){
        if(o instanceof THREE.Mesh && o.frustumCulled){
            o.frustumCulled = false;
            o.hadCullingEnabled = true;
        }
    });
    renderer.render(scene, camera);
    scene.traverse(function(o){
        if(o instanceof THREE.Mesh && o.hadCullingEnabled){
            o.frustumCulled = true;
            delete o.hadCullingEnabled;
        }
    });
    lastRenderTime = vwf_view.kernel.time();
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
            found = ( implementsIDs[i] == "http://vwf.example.com/blockly/controller.vwf" ); 
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
            foundLogger = ( prototypes[i] == "http://vwf.example.com/logger.vwf" );    
        }
    }
    return foundLogger;
}

function isGraphObject( prototypes ) {
    var foundObject = false;
    if ( prototypes ) {
        for ( var i = 0; i < prototypes.length && !foundObject; i++ ) {
            foundObject = prototypes[i] === "http://vwf.example.com/graphtool/graphline.vwf" ||
                          prototypes[i] === "http://vwf.example.com/graphtool/graphlinefunction.vwf" ||
                          prototypes[i] === "http://vwf.example.com/graphtool/graphplane.vwf" ||
                          prototypes[i] === "http://vwf.example.com/graphtool/graphgroup.vwf";
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
}

function setActiveBlocklyTab() {
    if ( currentBlocklyNodeID !== this.id ) {
        vwf_view.kernel.callMethod( appID, "selectBlocklyNode", [ this.vwfNodeName ] );
        if ( blocklyGraphID && blocklyGraphID === this.id ) {
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
            if( blocklyNodes[ nodeID ].blocklyExecuting ) {
                startBlocklyButton.className = "reset";
            } else {
                startBlocklyButton.className = "";
            }
        }
    }
    
    var blocklyFooter = document.getElementById( "blocklyFooter" );
    if ( nodeID === blocklyGraphID ) {
        blocklyFooter.style.display = "none";
    } else {
        blocklyFooter.style.display = "block";
    }
}

function getBlocklyNodeIDByName( name ) {
    var result;
    var keys = Object.keys( blocklyNodes );
    for ( var i = 0; i < keys.length; i++ ) {
        if ( name === blocklyNodes[ keys[ i ] ].name ) {
            result = keys[ i ];
            break;
        }
    }
    return result;
}

function updateBlocklyUI( blocklyNode ) {
    if ( Blockly.mainWorkspace ) {
        Blockly.mainWorkspace.maxBlocks = blocklyNode.ramMax;
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

function stopBlinkTab( nodeID ) {
    var tab = document.getElementById( nodeID );
    if ( tab && tab.isBlinking ) {
        tab.stopBlink();
    }
}

function blinkTabs() {
    var tabs = document.getElementsByClassName( "blocklyTab" );
    for ( var i = 0; i < tabs.length; i++ ) {
        if ( tabs[ i ].isBlinking )
        tabs[ i ].blink();
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
        if ( block.parentBlock_ ) {
            if ( block.parentBlock_.callType_ === "procedures_callnoreturn" || 
                block.parentBlock_.callType_ === "procedures_callreturn" ) {
                
                for ( var i = 0; i < workspace.topBlocks_.length; i++ ) {
                    //Loop through top blocks and find the stack who's first block isnt a procedure def
                    if ( workspace.topBlocks_[i].type !== "procedures_defnoreturn" && workspace.topBlocks_[i].type !== "procedures_defreturn" ) {
                        
                        var originBlock = workspace.topBlocks_[i];

                        // Have we already ducked into a procedure? If so, lets start there to save some time!

                        if ( currentProcedureBlockID !== undefined ) {
                            originBlock = workspace.getBlockById( currentProcedureBlockID );
                        } else {
                            // Is this first block a procedure block?
                            if ( originBlock.type === "procedures_callnoreturn" || 
                                originBlock.type === "procedures_callreturn" ) {
                                currentProcedureBlockID = originBlock.id;
                                var procpos = originBlock.getRelativeToSurfaceXY();
                                moveBlocklyProcedureIndicator( procpos.x, procpos.y );
                                break;
                            } 
                        }
                        
                        // Dive down the block stack and look for the next procedure call
                        // SJF Note: I couldn't find a way to match the procedure names for validation.

                        while ( true ) {
                            if ( originBlock.nextConnection.targetConnection.sourceBlock_ !== undefined ) {
                                var nextBlock = originBlock.nextConnection.targetConnection.sourceBlock_;
                                if ( nextBlock.type === "procedures_callnoreturn" || 
                                    nextBlock.type === "procedures_callreturn" ) {
                                    currentProcedureBlockID = nextBlock.id;
                                    var procpos = nextBlock.getRelativeToSurfaceXY();
                                    moveBlocklyProcedureIndicator( procpos.x, procpos.y );
                                    break;
                                } else {
                                    originBlock = nextBlock;
                                }
                            } else {
                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }

        // If the the parent block is the procedure block we were just in, we must have completed
        // that block's execution so we should hide the procedure tracer

        if ( block.parentBlock_ ) {
            if ( block.parentBlock_.id === currentProcedureBlockID ) {
                hideBlocklyProcedureIndicator();
            }
        }

        var pos = block.getRelativeToSurfaceXY();
        moveBlocklyIndicator( pos.x, pos.y );
    } else {
        hideBlocklyIndicator();
    }
}


function indicateProcedureBlock( blockID ) {
    var workspace, block;
    workspace = Blockly.getMainWorkspace();
    if ( workspace ) {
        block = workspace.getBlockById( blockID );
    }
    if ( block ) {
        var pos = block.getRelativeToSurfaceXY();
        moveBlocklyProcedureIndicator( pos.x, pos.y );
    } else {
        hideBlocklyProcedureIndicator();
    }
}


window.onkeypress = function( event ) {
    var pauseScreen;
    if ( event.which === 112 ) {
        pauseScreen = document.getElementById( "pauseScreen" );
        if ( pauseScreen.isOpen ){
            closePauseMenu();
        } else {// if ( renderMode === RENDER_GAME ) {
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
