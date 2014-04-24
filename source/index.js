var composer;
var HDRShader;
var hud;
var frame = 0;
var blocklyNodes = {};
var currentNode = undefined;



function onRun() {
    vwf_view.kernel.setProperty( vwf_view.kernel.application(), "executing", true );
}

window.addEventListener( "keyup", function (event) {
	switch ( event.keyCode ) {
		case 80:
			vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
	}
} );

vwf_view.firedEvent = function( nodeID, eventName, eventArgs ) {

    if ( eventName === "grabbed" ) {

        var client = eventArgs[0];

        if ( client === vwf_view.kernel.moniker() ) {

            var iconSrc = eventArgs[1];
            var screenPos = eventArgs[2];
            var parentName = eventArgs[3];
            createInventoryItem( nodeID, iconSrc, screenPos, parentName );

        }

    }

}

vwf_view.createdNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {
    
    if ( isBlockly3Node( childImplementsIDs ) ) {

        //console.info( "blocklyNode = " + childID );
        currentNode = blocklyNodes[ childID ] = { 
            "ID": childID, 
            "name": childName,
            "ram": 100, 
            "battery": 100,
            "ramMax": 100,
            "batteryMax": 100
        };

    }

}


vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childID === vwf_view.kernel.application() ) {
        vwf_view.kernel.kernel.views["vwf/view/threejs"].render = setUp;
    }

}

// vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {
//    if ( propertyName === "battery" ) {
//         // TODO: look at the nodeID to determine *which* rover this is, and handle it accordingly
//         hud.elements.batteryMeter.battery = propertyValue;
//    }
// }

vwf_view.initializedProperty = function( nodeID, propertyName, propertyValue ) {
    var node = blocklyNodes[ nodeID ];
    if ( node ) {
        switch ( propertyName ) {
            case "battery":
            case "batteryMax":
            case "ram":
            case "ramMax":
                vwf_view.satProperty( nodeID, propertyName, propertyValue );
                break;
        }
    } else if ( nodeID === vwf_view.kernel.application() ) {
        vwf_view.satProperty( nodeID, propertyName, propertyValue );
    }    
} 

vwf_view.satProperty = function( nodeID, propertyName, propertyValue ) {
    //console.info( "satProperty( "+nodeID+", "+propertyName+", "+propertyValue+" )" );
    var node = blocklyNodes[ nodeID ];
    if ( node ) {
        switch ( propertyName ) {
            case "battery":
            case "batteryMax":
            case "ram":
            case "ramMax":
                node[ propertyName ] = parseFloat( propertyValue );
                break;
        }
    } else if ( nodeID === vwf_view.kernel.application() ) {
        if ( propertyName == "blocklyUiNodeID" ) {
            node = blocklyNodes[ propertyValue ];
            if ( node ) {
                currentNode = node;
            }
        }
    }
}

function setUp( renderer, scene, camera ) {

    // Modify and add to scene
    scene.fog = new THREE.FogExp2( 0xAA9377, 0.000015 );
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
  
    // hud.elements.ramMeter.ram = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
    // hud.update();
    if ( currentNode !== undefined ) {
        hud.elements.batteryMeter.battery = ( currentNode.battery / currentNode.batteryMax ) * 100;
        hud.elements.ramMeter.ram = ( currentNode.ram / currentNode.ramMax ) * 100;
        hud.update();
    }

    renderer.clear();
    composer.render();
    renderer.clearDepth();
    renderer.render( hud.scene, hud.camera );
    frame = ++frame % 360;

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

//@ sourceURL=source/index.js
