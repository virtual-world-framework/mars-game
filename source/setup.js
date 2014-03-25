this.initialize = function() {
  // Perform additional setup
  vwf.views["vwf/view/threejs"].render = setUp;
}

// --------------------------------------------
var composer;
var HDRShader;
var hud;

function setUp( renderer, scene, camera ) {
  // Modify and add to scene
  scene.fog = new THREE.FogExp2( 0xAA9377, 0.000015 );
  renderer.setClearColor(scene.fog.color);

  // Set up HUD
  renderer.autoClear = false;
  hud = new HUD();

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
  vwf.views["vwf/view/threejs"].render = render;
}

function render( renderer, scene, camera ) {
  renderer.clear();
  composer.render();
  hud.update();
  hud.render( renderer );
}