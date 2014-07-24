var hud;
var blocklyNodes = {};
var graphLines = {};
var loggerNodes = {};
var currentBlocklyNodeID = undefined;
var blocklyExecuting = false;
var lastBlockIDExecuted = undefined;
var targetPath = undefined;
var mainRover = undefined;
var blocklyGraphID = undefined;
var alertNodeID = undefined;
var statusNodeID = undefined;
var isVisible = {
    graph: false,
    tiles: false
};
var gridBounds = {
    bottomLeft: undefined,
    topRight: undefined
};
var orbitTarget = undefined;

function onRun() {
    vwf_view.kernel.setProperty( currentBlocklyNodeID, "blockly_executing", true );
    vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_activeNodeID", undefined );
}

function onSetActive( btn ) {
    if ( currentBlocklyNodeID !== btn.id ) {
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_activeNodeID", btn.id );
        if ( blocklyGraphID && blocklyGraphID === btn.id ) {
            var cam = vwf_view.kernel.find( "", "//camera" )[ 0 ];
            if ( cam ) {
                vwf_view.kernel.setProperty( cam, "pointOfView", "topDown" );
            }
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

    var showLine = ( nodeID === blocklyGraphID );
    vwf_view.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "visible", showLine );
}

window.addEventListener( "keyup", function (event) {
    switch ( event.keyCode ) {
    }
} );

vwf_view.firedEvent = function( nodeID, eventName, eventArgs ) {

    if ( blocklyNodes[ nodeID ] !== undefined ) {
        var blocklyNode = blocklyNodes[ nodeID ];
        switch ( eventName ) {
            case "blocklyVisibleChanged":
                if ( eventArgs[ 0 ] ) {
                    currentBlocklyNodeID = nodeID;
                    updateBlocklyRamBar();
                    updateBlocklyUI( blocklyNode );
                    selectLastBlock();
                } else {
                    currentBlocklyNodeID = undefined;
                }
                break;

            case "topBlockCountChanged":
                if ( !blocklyExecuting ) {
                    if ( Blockly.mainWorkspace ) {
                        var topBlockCount = Number( eventArgs[ 0 ] );
                        var runButton = document.getElementById( "runButton" );
                        runButton.className = topBlockCount !== 1 ? "disabled" : "" ;
                        // if disabled then need to set the tooltip
                        // There must be only one program for each blockly object
                    }
                }
                break;

            case "blocklyStarted":
                var stopButton = document.getElementById( "stopButton" );
                stopButton.className = "";
                var indicator = document.getElementById( "blocklyIndicator" );
                indicator.className = "";
                indicator.style.visibility = "inherit";
                break;

            case "blocklyStopped":
                var indicator = document.getElementById( "blocklyIndicator" );
                indicator.className = "stopped";                
            case "blocklyErrored":
                var stopButton = document.getElementById( "stopButton" );
                stopButton.className = "disabled";
                break;

            case "transformChanged":
                if ( nodeID === vwf_view.kernel.find( "", targetPath )[ 0 ] ) {
                    var targetTransform = eventArgs[ 0 ];
                    if ( targetTransform ) {
                        orbitTarget = [ targetTransform[ 12 ], targetTransform[ 13 ], targetTransform[ 14 ] ];
                    }
                }
        }
    } else if ( nodeID === this.kernel.application() ) {
        
        switch ( eventName ) {
            
            case "blocklyContentChanged":
                if ( currentBlocklyNodeID !== undefined ) {
                    var currentCode = getBlocklyFunction();
                    this.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "lineFunction", currentCode );

                    indicateLastBlock();
                }
                break;
            case "blockExecuted":
                var blockName = eventArgs[ 0 ];
                var blockID = eventArgs[ 1 ];
                if ( blockName ) {
                    if ( blockName.indexOf( "repeat" > -1 ) ) {
                        blockName = blockName.indexOf( "times" ) > -1 ? "repeatTimes" : blockName;
                    }
                    pushNextBlocklyStatus( blockName );
                }
                if ( blockID ) {
                    var workspace = Blockly.getMainWorkspace();
                    var block = workspace ? workspace.getBlockById( blockID ) : undefined;
                    if ( block ) {
                        if ( Blockly.selected ) {
                            Blockly.selected.unselect();
                        }
                        block.select();
                        var pos = block.getRelativeToSurfaceXY();
                        moveBlocklyIndicator( pos.x, pos.y );
                    }
                    lastBlockIDExecuted = blockID;
                }
                break;

            case "scenarioReset":
                resetStatusDisplay();
            case "scenarioChanged":

                removePopup();
                removeFailScreen();
                clearBlocklyStatus();
                gridBounds = eventArgs[ 1 ] || gridBounds;
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

            case "enableHelicam":
                setHelicamButtonsEnabled( true );
                break;
            case "disableHelicam":
                setHelicamButtonsEnabled( false );
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
            case "selectLastBlock":
                selectLastBlock();
                break;
        } 

    } else if ( loggerNodes[ nodeID ] !== undefined ) { 

        switch ( eventName ) {
            
            case "logAdded":
                var msg = eventArgs[ 0 ];
                var msgType = loggerNodes[ nodeID ].name;
                if ( msgType ) {
                    pushToDisplay( msgType, msg.log );
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

        // nodeID is ignored here?
        if ( eventName === "completed" ) {
            var message = eventArgs[ 0 ];
            if ( message ) {
                displayPopup( "success", message );
            } else {
                advanceScenario();
            }
        }

        // nodeID is ignored here?
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

        // TODO: Decide if inventory HUD element should be displayed,
        // redesigned, or removed entirely.

        // if ( eventName === "pickedUp" ) {
        //     var iconSrc = eventArgs[ 0 ];
        //     var index = eventArgs[ 1 ];
        //     var parentName = eventArgs[ 2 ];
        //     addSlotIcon( nodeID, iconSrc, index, parentName );
        // }

        // if ( eventName === "dropped" ) {
        //     removeSlotIcon( nodeID );
        // }

    }

}

vwf_view.createdNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childName === "rover" ) {
        mainRover = childID;
    }
  
    var protos = getPrototypes.call( this, vwf_view.kernel, childExtendsID );

    if ( isBlocklyNode( childImplementsIDs ) ) {

        //console.info( "blocklyNode = " + childID );
        blocklyNodes[ childID ] = { 
            "ID": childID, 
            "name": childName,
            "ram": 15, 
            "ramMax": 15
        };

        if ( childName === "graph" ) {
            blocklyGraphID = childID;
        }

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

        if ( childName === "status" ) {
            statusNodeID = childID;
        } else if ( childName === "alerts" ) {
            alertNodeID = childID;
        }
    } 

}


vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childID === vwf_view.kernel.application() ) {
        hud = new HUD();
        createHUD();

        var threejs = findThreejsView();
        threejs.render = setUp;

        setUpNavigation();

    } else if ( blocklyNodes[ childID ] !== undefined ) {
        var node = blocklyNodes[ childID ];
        if ( $( "#blocklyWrapper-top" ) !== undefined ) {
            $( "#blocklyWrapper-top" ).append( 
                "<div id='" + childID + "' class='blocklyTab' onclick='onSetActive(this)'>"+childName+"</div>"
            ).children(":last"); 
        }
    }
}

vwf_view.deletedNode = function( nodeID ) {
    
    if ( blocklyNodes[ nodeID ] !== undefined ) {
        
        delete blocklyNodes[ nodeID ];

        var blocklyTop = document.getElementById( "blocklyWrapper-top" );
        var tab = document.getElementById( nodeID );

        if ( blocklyTop && tab ) {
            blocklyTop.removeChild( tab );
        }
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
                    // the mainWorkSpace is not valid until the UI is visible
                    if ( Blockly.mainWorkspace ) {
                        Blockly.mainWorkspace.maxBlocks = Number( propertyValue );    
                    }
                }
                updateBlocklyRamBar();
                break;

            case "blockly_executing":
                var exe = Boolean( propertyValue );

                //Disables the run button
                document.getElementById( "runButton" ).className = exe ? "disabled" : "";
                
                blocklyExecuting = exe;
                break;

        }
    } 

    if ( nodeID === vwf_view.kernel.find( "", "//camera" )[0] ) {

        if ( propertyName === "targetPath" ) {
            if ( targetPath !== propertyValue ) {
                targetPath = propertyValue;
            }
        }

        if ( propertyName === "pointOfView" ) {
            if ( hud ) {
                var selector = hud.elements[ "cameraSelector" ];
                var pov = hud.elements[ "camera_" + propertyValue ];
                selector.activeMode.icon = pov.icon;
                selector.activeMode.type = pov.mode;
            }
        }
    }

    if ( nodeID === vwf_view.kernel.application() ) {
        if ( propertyName === "blockly_activeNodeID" ) {
            selectBlocklyTab( propertyValue );
        }
    }

    var loggerNode = loggerNodes[ nodeID ];
    if ( loggerNode ) {
        switch ( propertyName ) {

            case "logger_maxLogs":
                loggerNode[ propertyName ] = parseFloat( propertyValue );
                break;

            case "logger_lifeTime":
                loggerNode[ propertyName ] = parseFloat( propertyValue );
                break;
        }
    }
}

function setUp( renderer, scene, camera ) {

    //Set up the introductory screens
    var introScreens = new Array();
    introScreens.push( "assets/images/introScreens/Intro_screen.jpg" );
    setUpIntro( introScreens );

    setUpBlocklyPeripherals();
    setUpStatusDisplay();

    // Modify and add to scene
    scene.fog = new THREE.FogExp2( 0xC49E70, 0.005 );
    renderer.setClearColor(scene.fog.color);
    renderer.autoClear = false;

    // Set render loop to use custom render function
    var threejs = findThreejsView();
    threejs.render = render;

}

function render( renderer, scene, camera ) {

    hud.update();

    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( hud.scene, hud.camera );

}

function findThreejsView() {
    var lastKernel = vwf_view;
    while ( lastKernel.kernel ) {
        lastKernel = lastKernel.kernel;
    }
    return lastKernel.views[ "vwf/view/threejs" ];
}

function isBlockly3Node( nodeID ) {
    return self.kernel.test( nodeID,
        "self::element(*,'http://vwf.example.com/blockly/controller.vwf')",
        nodeID );
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
            foundObject = ( prototypes[i] == "http-vwf-example-com-graphtool-graphline-vwf" ) ||
                ( prototypes[i] == "http-vwf-example-com-graphtool-graphlinefunction-vwf" ) ||
                ( prototypes[i] == "http-vwf-example-com-graphtool-graphplane-vwf" ) ||
                ( prototypes[i] == "http-vwf-example-com-graphtool-graphgroup-vwf" );
        }
    }

    return foundObject;
}

function getBlocklyFunction() {
    var topBlocks = Blockly.mainWorkspace.getTopBlocks( false );
    var yBlock = undefined;
    // Set yBlock to only the code plugged into 'graph_set_y'.
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
    vwf_view.kernel.callMethod( vwf_view.kernel.application(), "resetScenario" );
}

function advanceScenario() {
    vwf_view.kernel.callMethod( vwf_view.kernel.application(), "advanceScenario" );
}

function updateBlocklyUI( blocklyNode ) {
    if ( Blockly.mainWorkspace ) {
        Blockly.mainWorkspace.maxBlocks = blocklyNode.ramMax;
    }
}

function blinkTab( nodeID ) {
    var tab = document.getElementById( nodeID );

    if ( tab && tab.stopBlink ) {
        // Tab has already been set to blink
        return;
    }

    var time, lastBlinkTime, rafID, oldClickHandler;
    var blinkInterval = 0.25;

    var blink = function() {
        time = vwf_view.kernel.time();
        lastBlinkTime = lastBlinkTime || time;
        if ( time - lastBlinkTime > blinkInterval ) {
            tab.style.opacity = "0.5";

            if ( time - lastBlinkTime > blinkInterval * 2 ) {
                lastBlinkTime = time;
            }
        } else {
            tab.style.opacity = "1";
        }

        rafID = requestAnimationFrame( blink );
    }

    if ( tab && tab.className.indexOf( "blocklyTab" ) !== -1 ) {
        rafID = requestAnimationFrame( blink );
        tab.stopBlink = ( function( event ) {
            tab.style.opacity = "1";
            cancelAnimationFrame( rafID );
            delete tab.stopBlink;
        } );
    }
}

function stopBlinkTab( nodeID ) {
    var tab = document.getElementById( nodeID );

    if ( tab && tab.stopBlink ) {
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

function selectLastBlock() {
    var workspace = Blockly.getMainWorkspace();
    var block = workspace ? workspace.getBlockById( lastBlockIDExecuted ) : undefined;
    if ( block ) {
        if ( Blockly.selected ) {
            Blockly.selected.unselect();
        }        
        block.select();     
    }
}

function indicateLastBlock() {
    var workspace = Blockly.getMainWorkspace();
    var block = workspace ? workspace.getBlockById( lastBlockIDExecuted ) : undefined;
    if ( block ) {
        var pos = block.getRelativeToSurfaceXY();
        moveBlocklyIndicator( pos.x, pos.y );
    } else {
        resetBlocklyIndicator();
    }
}

//@ sourceURL=source/index.js
