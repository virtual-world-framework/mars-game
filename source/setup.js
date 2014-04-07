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
  
  hud.elements.batteryMeter.battery = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
  hud.update();

  renderer.clear();
  composer.render();
  renderer.clearDepth();
  renderer.render( hud.scene, hud.camera );
  frame = ++frame % 360;

}

function createHUD() {

  var batteryMeter = new HUD.Element( "batteryMeter", drawEnergyMeter, 250, 40);
  batteryMeter.battery = 100;
  batteryMeter.maxBattery = 100;
  hud.add( batteryMeter, "left", "bottom", { "x": 30, "y": -30 } );

  var dragTest = new HUD.Element( "dragEl", drawDraggable, 128, 16 );
  dragTest.isDragging = false ;
  dragTest.startPos = { "x": 0, "y": 0 };
  dragTest.onMouseDown = startDragging;
  dragTest.onMouseUp = stopDragging;
  dragTest.onMouseOut = drag;
  dragTest.onMouseMove = drag;
  hud.add( dragTest );

  var dragTest2 = new HUD.Element( "dragEl2", drawDraggable2, 128, 16 );
  dragTest2.isDragging = false ;
  dragTest2.startPos = { "x": 0, "y": 0 };
  dragTest2.onMouseDown = startDragging;
  dragTest2.onMouseUp = stopDragging;
  dragTest2.onMouseOut = drag;
  dragTest2.onMouseMove = drag;
  hud.add( dragTest2 );

}

function drawEnergyMeter( context, position ) {

  var battery = this.battery;
  var maxBattery = this.maxBattery;
  var meterWidth = (this.width - 10) * battery / maxBattery;
  var meterHeight = (this.height - 10);

  context.strokeStyle = "rgb(255,255,255)";
  context.lineWidth = 3;
  context.strokeRect( position.x, position.y, this.width, this.height );
  context.fillStyle = "rgb(50,110,220)";
  context.fillRect( position.x + 5, position.y + 5, meterWidth, meterHeight );

  context.textBaseline = "bottom";
  context.font = '16px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText("Battery:", position.x, position.y - 4);

  context.textBaseline = "top";
  context.font = 'bold 28px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText(Math.round(battery), position.x + 25, position.y + 4);

}

function drawDraggable( context, position ) {

  context.fillStyle = "rgb(125,0,125)";
  context.fillRect( position.x, position.y, 16, 16 );
  context.fillStyle = "rgba(25,25,25,0.75)";
  context.fillRect( position.x + 16, position.y, 112, 16 );

  context.textBaseline = "top";
  context.font = '12px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText("( x: " + position.x + ", y: " + position.y + " )", position.x + 20, position.y);

}

function drawDraggable2( context, position ) {

  context.fillStyle = "rgb(0,125,0)";
  context.fillRect( position.x, position.y, 16, 16 );
  context.fillStyle = "rgba(25,25,25,0.75)";
  context.fillRect( position.x + 16, position.y, 112, 16 );

  context.textBaseline = "top";
  context.font = '12px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText("( x: " + position.x + ", y: " + position.y + " )", position.x + 20, position.y);

}

function startDragging( event ) {

  if ( event.which === 1 ) {

    this.isDragging = true;
    this.startPos.x = event.clientX;
    this.startPos.y = event.clientY;
    hud.moveToTop( this.id );

  }

}

function stopDragging( event ) {

  this.isDragging = false;

}

function drag( event ) {

  if ( this.isDragging && event.which === 1 ) {

    var movX = event.clientX - this.startPos.x;
    var movY = event.clientY - this.startPos.y;

    this.offset.x += movX;
    this.offset.y += movY;

    this.startPos.x = event.clientX;
    this.startPos.y = event.clientY;

    // Prevent element from losing mouse position
    this.isMouseOver = true;

    var picks = hud.pick( event );
    picks.splice( picks.indexOf( this ), 1 );

  } else {

    this.isDragging = false;

  }

}

//@ sourceURL=source/setup.js