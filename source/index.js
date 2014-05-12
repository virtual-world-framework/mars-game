var composer;
var HDRShader;
var hud;
var blocklyNodes = {};
var firstPersonMode = true;
var currentBlocklyNodeID = undefined;
var blocklyExecuting = false;

function onRun() {
    vwf_view.kernel.setProperty( currentBlocklyNodeID, "executing", true );
}

window.addEventListener( "keyup", function (event) {
	switch ( event.keyCode ) {
		case 80:
			vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
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

            case "moveFailed":
                stopBlocklyExecution();
                break;

            case "batteryChanged":
                var currentBattery = Number( eventArgs[ 0 ] );
                if ( currentBattery <= 0 ) {
                    stopBlocklyExecution();    
                } 
                break;   

        }
    } else {

        // nodeID is ignored here?
        if ( eventName === "grabbed" ) {

            var client = eventArgs[0];

            if ( client === vwf_view.kernel.moniker() ) {

                var iconSrc = eventArgs[1];
                var screenPos = eventArgs[2];
                var parentName = eventArgs[3];
                createInventoryItem( nodeID, iconSrc, screenPos, parentName );

            }

        } 

        // nodeID is ignored here?
        if ( eventName === "completed" ) {

            endScenario( "success" );

        }

        // nodeID is ignored here?
        if ( eventName === "failed" ) {

            endScenario( "failure" );

        }

    }

}

vwf_view.createdNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {
    
    if ( isBlockly3Node( childImplementsIDs ) ) {

        //console.info( "blocklyNode = " + childID );
        blocklyNodes[ childID ] = { 
            "ID": childID, 
            "name": childName,
            "ram": 100, 
            "battery": 100,
            "ramMax": 100,
            "batteryMax": 100,
            "allowedBlocks": 10
        };

    }

}


vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childID === vwf_view.kernel.application() ) {
        vwf_view.kernel.kernel.views["vwf/view/threejs"].render = setUp;
    }

}

vwf_view.initializedProperty = function( nodeID, propertyName, propertyValue ) {
    vwf_view.satProperty( nodeID, propertyName, propertyValue );
} 

vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {

    //console.info( "satProperty( "+nodeID+", "+propertyName+", "+propertyValue+" )" );
    var blocklyNode = blocklyNodes[ nodeID ];
    if ( blocklyNode ) {
        switch ( propertyName ) {

            case "battery":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    hud.elements.batteryMeter.battery = parseFloat( propertyValue );  
                }
                break;

            case "batteryMax":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    hud.elements.batteryMeter.maxBattery = parseFloat( propertyValue );    
                }
                break;

            case "ram":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    hud.elements.ramMeter.ram = parseFloat( propertyValue );    
                }
                break;

            case "ramMax":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    hud.elements.ramMeter.maxRam = parseFloat( propertyValue );
                }
                break;

            case "blockCount":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                break;

            case "allowedBlocks":
                blocklyNode[ propertyName ] = parseFloat( propertyValue );
                if ( nodeID == currentBlocklyNodeID ) {
                    // the mainWorkSpace is not valid until the UI is visible
                    if ( Blockly.mainWorkspace ) {
                        Blockly.mainWorkspace.maxBlocks = Number( propertyValue );    
                    }
                }
                break;

            case "executing":
                var exe = Boolean( propertyValue );
                // the run button should be disabled while the 
                // current blocks are being executed
                document.getElementById( "runButton" ).disabled = exe;
                blocklyExecuting = exe;
                break;

        }
    } 

    // nodeID is ignored here?
    if ( propertyName === "isFirstPerson" ) {
        hud.elements.blocklyButton.visible = Boolean( propertyValue );;
        firstPersonMode = Boolean( propertyValue );
    }

}

function setUp( renderer, scene, camera ) {

    // Modify and add to scene
    scene.fog = new THREE.FogExp2( 0xAA9377, 0.005 );
    renderer.setClearColor(scene.fog.color);

    // Set up HUD
    renderer.autoClear = false;
    hud = new HUD();
    createHUD();

    // Set up post-processing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    // Initialize the environment shader
    var EnvironmentShader = new THREE.ShaderPass( MGShaders.Environment );

    // Initialize the HDR lighting shader
    HDRShader = new THREE.ShaderPass( MGShaders.HDR );
    HDRShader.uniforms[ 'exposure' ].value = 0.000015;

    // Final pass that renders the processed image to the screen
    var FinalPass = new THREE.ShaderPass( THREE.CopyShader );
    FinalPass.renderToScreen = true;

    // Add passes to the effect composer
    composer.addPass( EnvironmentShader );
    composer.addPass( HDRShader );
    composer.addPass( FinalPass );

    // Set render loop to use custom render function
    vwf_view.kernel.kernel.views["vwf/view/threejs"].render = render;

}

function render( renderer, scene, camera ) {

    showHud( firstPersonMode || currentBlocklyNodeID !== undefined ); 
    hud.update();

    renderer.clear();
    composer.render();
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
        hud.elements.batteryMeter.visible = show;
        hud.elements.ramMeter.visible = show;
        hud.elements.cargo.visible = show;
    }
}

function updateHudElements( blocklyNode ) {
    hud.elements.batteryMeter.battery = blocklyNode.battery;
    hud.elements.batteryMeter.maxBattery = blocklyNode.batteryMax;
    hud.elements.ramMeter.ram = blocklyNode.ram;
    hud.elements.ramMeter.maxRam = blocklyNode.ramMax;  
    if ( Blockly.mainWorkspace ) {
        Blockly.mainWorkspace.maxBlocks = blocklyNode.allowedBlocks;    
    }
}

function stopBlocklyExecution( id ) {
    if ( id === undefined ) {
        vwf_view.kernel.callMethod( vwf_view.kernel.application(), "stopAllExecution", [ true ] );
    } else {
        vwf_view.kernel.setProperty( id, "stopExecution", [ true ] );
    }

}

//@ sourceURL=source/index.js
