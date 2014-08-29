var camera, canvasForRender, renderer, scene, loader, light, material;

window.onload = function() {

    // Set up camera for the scene
    var offsetX = -135;
    var offsetY = -106;
    var halfSize = 163;
    camera = new THREE.OrthographicCamera(
        offsetX - halfSize, offsetX + halfSize, 
        offsetY - halfSize, offsetY + halfSize,
        1, 1000 
    );
    camera.position.set( 0, 0, -5 );
    camera.rotateX( Math.PI );

    // Create a renderer for the scene
    canvasForRender = document.getElementById( "3Dcanvas" );
    renderer = new THREE.WebGLRenderer( {
        canvas: canvasForRender,
        preserveDrawingBuffer: true
    } );
    // renderer.setClearColor( 0x000099 );
    renderer.setSize( 2048, 2048 );

    // Create the three.js scene
    scene = new THREE.Scene();

    // Load the 3D model
    loader = new THREE.ColladaLoader();
    loader.load( "collision_terrain.dae", function( object ) {
        scene.add( object.scene );
    } );

    // Set up a light for the scene
    light = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( light );

    // Set up a shader material for the ground - where we will do our magic
    material = new THREE.ShaderMaterial( { } );

    requestAnimationFrame( render );

    document.addEventListener( "keypress", generateHeightmap );
}

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}

function generateHeightmap() {
    var imageData = canvasForRender.toDataURL( "image/png" );
    document.location.href = imageData.replace( "image/png", "image/octet-stream" );
}