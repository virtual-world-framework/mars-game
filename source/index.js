var hud;
var blocklyNodes = {};
var graphLines = {};
var currentBlocklyNodeID = undefined;
var blocklyExecuting = false;
var targetID = undefined;
var mainRover = undefined;

function onRun() {
    vwf_view.kernel.setProperty( currentBlocklyNodeID, "blockly_executing", true );
}

window.addEventListener( "keyup", function (event) {
    switch ( event.keyCode ) {
        case 80:
            vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
            break;
    }
} );

vwf_view.firedEvent = function( nodeID, eventName, eventArgs ) {

    if ( blocklyNodes[ nodeID ] !== undefined ) {
        var blocklyNode = blocklyNodes[ nodeID ];
        switch ( eventName ) {
            case "blocklyVisibleChanged":
                if ( eventArgs[ 0 ] ) {
                    currentBlocklyNodeID = nodeID;
                    updateHudElements( blocklyNode );    
                } else {
                    currentBlocklyNodeID = undefined;    
                }
                break;

            case "topBlockCountChanged":
                if ( !blocklyExecuting ) {
                    if ( Blockly.mainWorkspace ) {
                        var topBlockCount = Number( eventArgs[ 0 ] );
                        document.getElementById( "runButton" ).disabled = ( topBlockCount !== 1 );
                        // if disabled then need to set the tooltip
                        // There must be only one program for each blockly object
                    }
                }
                break;

        }
    } else if ( nodeID === this.kernel.application() ) {
        
        switch ( eventName ) {
            
            case "blocklyContentChanged":
                if ( currentBlocklyNodeID !== undefined ) {
                    var currentCode = getBlocklyFunction();
                    if ( currentCode !== undefined ) {
                        this.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "lineFunction", currentCode );
                        vwf_view.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "visible", true );
                    } else {
                        vwf_view.kernel.setProperty( graphLines[ "blocklyLine" ].ID, "visible", false );
                    }
                }
                break;
        } 

    } else {

        // nodeID is ignored here?
        if ( eventName === "completed" ) {

            endScenario( "success" );

        }

        // nodeID is ignored here?
        if ( eventName === "failed" ) {

            endScenario( "failure" );

        }

        if ( eventName === "pickedUp" ) {
            var iconSrc = eventArgs[ 0 ];
            var index = eventArgs[ 1 ];
            var parentName = eventArgs[ 2 ];
            addSlotIcon( nodeID, iconSrc, index, parentName );
        }

    }

}

vwf_view.createdNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childName === "rover" ) {
        mainRover = childID;
    }
  
    var protos = getPrototypes.call( this, vwf_view.kernel, childExtendsID );

    if ( isBlockly3Node( childImplementsIDs ) ) {

        //console.info( "blocklyNode = " + childID );
        blocklyNodes[ childID ] = { 
            "ID": childID, 
            "name": childName,
            "ram": 15, 
            "battery": 30,
            "ramMax": 15,
            "batteryMax": 50,
            "allowedBlocks": 15
        };

    } else if ( isGraphlineNode( protos ) && childName === "blocklyLine" ) {
        graphLines[ childName ] = { 
            "ID": childID, 
            "name": childName
        } 
    }

}


vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childID === vwf_view.kernel.application() ) {
        hud = new HUD();
        createHUD();
        vwf_view.kernel.kernel.views["vwf/view/threejs"].render = setUp;
    } 
}

vwf_view.initializedProperty = function( nodeID, propertyName, propertyValue ) {
    vwf_view.satProperty( nodeID, propertyName, propertyValue );
} 

vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {

    var blocklyNode = blocklyNodes[ nodeID ];
    if ( blocklyNode ) {
        switch ( propertyName ) {

            case "battery":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID === mainRover ) {
                    hud.elements.batteryMeter.battery = parseFloat( propertyValue );  
                }
                break;

            case "batteryMax":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID === mainRover ) {
                    hud.elements.batteryMeter.maxBattery = parseFloat( propertyValue );    
                }
                break;

            case "ram":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    hud.elements.ramMeter.ram = parseFloat( propertyValue );    
                }
                break;

            case "blockly_blockCount":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                break;

            case "blockly_allowedBlocks":
                blocklyNode[ propertyName ] = Number( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    // the mainWorkSpace is not valid until the UI is visible
                    hud.elements.ramMeter.maxRam = Number( propertyValue );
                    if ( Blockly.mainWorkspace ) {
                        Blockly.mainWorkspace.maxBlocks = Number( propertyValue );    
                    }
                }
                break;

            case "blockly_executing":
                var exe = Boolean( propertyValue );
                // the run button should be disabled while the 
                // current blocks are being executed
                document.getElementById( "runButton" ).disabled = exe;
                blocklyExecuting = exe;
                break;

        }
    } 

    if ( nodeID === vwf_view.kernel.find( "", "//camera" )[0] ) {

        if ( propertyName === "target" ) {
            targetID = vwf_view.kernel.find( "", "//" + propertyValue )[ 0 ];
        }
    }

}

function setUp( renderer, scene, camera ) {

    //Set up the introductory screens
    setUpIntro();

    // Modify and add to scene
    scene.fog = new THREE.FogExp2( 0xC49E70, 0.005 );
    renderer.setClearColor(scene.fog.color);
    renderer.autoClear = false;

    // Set render loop to use custom render function
    vwf_view.kernel.kernel.views["vwf/view/threejs"].render = render;

}

function render( renderer, scene, camera ) {

    // showHud( targetID !== undefined ); 
    hud.update();

    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( hud.scene, hud.camera );

}

function isBlockly3Node( implementsIDs ) {
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

function isGraphlineNode( prototypes ) {

    var foundGraph = false;

    if ( prototypes ) {
        for ( var i = 0; i < prototypes.length && !foundGraph; i++ ) {
            foundGraph = ( prototypes[i] == "http-vwf-example-com-graphline-vwf" );    
        }
    }

    return foundGraph;

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
};

function endScenario( endType ) {

    var blocker = document.createElement( 'DIV' );
    blocker.style.backgroundColor = "#000000";
    blocker.style.position = "absolute";
    blocker.style.top = "0px";
    blocker.style.left = "0px";
    blocker.style.bottom = "0px";
    blocker.style.right = "0px";
    blocker.style.opacity = "0.5";
    blocker.style.zIndex = "99";

    var div = document.createElement( 'DIV' );
    div.id = "gameOver";
    div.onclick = loadNewSession;
    div.style.height = "256px";
    div.style.width = "512px";
    div.style.marginLeft = "-256px";
    div.style.marginTop = "-128px";
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.backgroundColor = "#333444";
    div.style.textAlign = "center";
    div.style.color = "#FFFFFF";
    div.style.zIndex = "100";

    if ( endType === "success" ) {
        div.innerHTML = "<h1>Success</h1>";
    } else if ( endType === "failure" ) {
        div.innerHTML = "<h1>Objective Failed</h1>";
    } else {
        div.innerHTML = "<h1>Game Over</h1>";
    }

    div.innerHTML += "\nClick here to try again.";
    document.body.appendChild(blocker);
    document.body.appendChild(div);

}

function loadNewSession() {
    window.location.assign( window.location.origin + "/mars-game/" );
}

function showHud( show ) {
    if ( hud && hud.elements ) {
        hud.visible = show;
    }
}

function updateHudElements( blocklyNode ) {
    hud.elements.batteryMeter.battery = blocklyNode.battery;
    hud.elements.batteryMeter.maxBattery = blocklyNode.batteryMax;
    hud.elements.ramMeter.ram = blocklyNode.ram;
    hud.elements.ramMeter.maxRam = blocklyNode.allowedBlocks;  
    if ( Blockly.mainWorkspace ) {
        Blockly.mainWorkspace.maxBlocks = blocklyNode.allowedBlocks;    
    }
}

//@ sourceURL=source/index.js
