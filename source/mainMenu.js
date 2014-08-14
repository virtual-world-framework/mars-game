MainMenu = function() {
    this.initialize();
    return this;
}

MainMenu.prototype = {
    constructor: MainMenu,
    scene: undefined,
    camera: undefined,

    initialize: function() {
        var loader, rover, geo, ground, groundMat, light, ambient;

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.set( 0, 0, 2.5 );
        this.camera.rotateX( Math.PI / 2.3 );
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xFFFFFF, 4, 30 );
        loader = new THREE.ColladaLoader();
        loader.load( "assets/3d/Rover/rover_retro.dae", this.placeRover.bind( this ) );
        light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
        light.intensity = 1.2;
        light.position.set( -2, 0, 6 );
        ambient = new THREE.AmbientLight( 0xAAAAAA );
        groundMat = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, side: THREE.BackSide } );
        geo = new THREE.CubeGeometry( 50, 50, 50 );
        ground = new THREE.Mesh( geo, groundMat );
        ground.position.set( 0, 0, 25 );
        this.scene.add( light );
        this.scene.add( ambient );
        this.scene.add( ground );
    },

    placeRover: function( collada ) {
        var rover = collada.scene;
        rover.position.set( 2, 5, 0 );
        rover.rotateZ( Math.PI / 1.5 );
        this.scene.add( rover );
    }
}

//@ sourceURL=source/mainMenu.js