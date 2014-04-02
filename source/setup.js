this.initialize = function() {
  this.initializeActiveCamera( this.player.camera );

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
  vwf.views["vwf/view/threejs"].render = render;

}

var frame = 0;
function render( renderer, scene, camera ) {
  
  hud.elements.energyMeter.properties.energy = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
  hud.update();

  renderer.clear();
  composer.render();
  renderer.clearDepth();
  renderer.render( hud.scene, hud.camera );
  frame = ++frame % 360;

}

function createHUD() {

  var params = {

    "width": 250,
    "height": 40,

    "vars": {

      "energy": 100,
      "maxEnergy": 100

    },

    "drawFunc": drawEnergyMeter

  };

  hud.createElement(

    "energyMeter",
    "left",
    "bottom",
    { x: 30, y: -30},
    params

  );
}

function drawEnergyMeter( context, position ) {

  var energy = this.properties.energy;
  var maxEnergy = this.properties.maxEnergy;
  var meterWidth = (this.width - 10) * energy / maxEnergy;
  var meterHeight = (this.height - 10);

  context.strokeStyle = "rgb(255,255,255)";
  context.lineWidth = 3;
  context.strokeRect( position.x, position.y, this.width, this.height );
  context.fillStyle = "rgb(50,110,220)";
  context.fillRect( position.x + 5, position.y + 5, meterWidth, meterHeight );

  context.textBaseline = "bottom";
  context.font = '16px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText("Energy:", position.x, position.y - 4);

  context.textBaseline = "top";
  context.font = 'bold 28px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText(Math.round(energy), position.x + 25, position.y + 4);

}