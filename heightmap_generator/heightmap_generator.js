var camera, canvasForRender, renderer, scene, loader, light, material, env;
var near = 0.0;
var far = 10.0;

window.onload = function() {

    // Set up camera for the scene
    var offsetX = -135;
    var offsetY = 106;
    var halfSize = 163;
    camera = new THREE.OrthographicCamera(
        offsetX - halfSize, offsetX + halfSize,
        offsetY + halfSize, offsetY - halfSize,
        near, far
    );
    camera.position.set( 0, 0, 7.5 );
    // camera.rotateX( -Math.PI );
    camera.lookAt(new THREE.Vector3(0,0,0));

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
        env = object.scene;
        setHeightMapType( "gray" );
        // env.rotateX( Math.PI );
        scene.add( env );
    } );

    // Set up a light for the scene
    light = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( light );

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

function findAllMeshes( object ) {
    var meshes = [];
    for ( var i = 0; i < object.children.length; i++ ) {
        if ( object.children[ i ] instanceof THREE.Mesh ) {
            meshes.push( object.children[ i ] );
        } else {
            var childMeshes = findAllMeshes( object.children[ i ] );
            for ( var j = 0; j < childMeshes.length; j++ ) {
                meshes.push( childMeshes[ j ] );
            }
        }
    }
    return meshes;
}

function setHeightMapType( mapType ) {
    switch ( mapType ) {
        case 0:
        case "gray":
            material = new THREE.ShaderMaterial(
                { "vertexShader": document.getElementById( "vertexShader" ).textContent,
                  "fragmentShader": document.getElementById( "fragmentShaderGray" ).textContent 
                } );
            break;
        case 1:
        case "rgb":
            material = new THREE.ShaderMaterial(
                { "vertexShader": document.getElementById( "vertexShader" ).textContent,
                  "fragmentShader": document.getElementById( "fragmentShaderRGB" ).textContent 
                } );
            break;
        case 2:
        case "exp":
            material = new THREE.ShaderMaterial(
                { "vertexShader": document.getElementById( "vertexShader" ).textContent,
                  "fragmentShader": document.getElementById( "fragmentShader" ).textContent 
                } );
            break;
        default:
            material = new THREE.ShaderMaterial(
                { "vertexShader": document.getElementById( "vertexShader" ).textContent,
                  "fragmentShader": document.getElementById( "fragmentShaderGray" ).textContent 
                } );
            break;
    }
    var meshes = findAllMeshes( env );
    for ( var i = 0; i < meshes.length; i++ ) {
        meshes[ i ].material = material;
    }
}