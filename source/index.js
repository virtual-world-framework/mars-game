var composer;
var HDRShader;
var hud;
var frame = 0;



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


}

vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( childID === vwf_view.kernel.application() ) {
        vwf_view.kernel.kernel.views["vwf/view/threejs"].render = setUp;
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
  
    hud.elements.batteryMeter.battery = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
    hud.elements.ramMeter.ram = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
    hud.update();

    renderer.clear();
    composer.render();
    renderer.clearDepth();
    renderer.render( hud.scene, hud.camera );
    frame = ++frame % 360;

}

//@ sourceURL=source/index.js